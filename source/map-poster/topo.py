# Topography for the region map: SRTM 1" DEM (hillshade, contours, hachures) + OSM woods
import json, math
import numpy as np
from scipy.ndimage import gaussian_filter, maximum_filter
from matplotlib.collections import LineCollection
from matplotlib.patches import Polygon
from shapely.geometry import Polygon as SPoly, LineString, Point
from shapely.ops import polygonize, unary_union
from shapely import prepared

def load_dem(lat0, lat1, lon0, lon1, step=2):
    def ld(t): return np.fromfile(f"dem/{t}.hgt", ">i2").reshape(3601, 3601)
    a = np.hstack([ld("N37E012")[:, :3600], ld("N37E013")]).astype(float)
    lat = 38 - np.arange(3601) / 3600; lon = 12 + np.arange(7201) / 3600
    i0, i1 = np.searchsorted(-lat, [-lat1, -lat0]); j0, j1 = np.searchsorted(lon, [lon0, lon1])
    z = a[i0:i1:step, j0:j1:step][::-1]          # south -> north
    z[z < -100] = np.nan; z = np.nan_to_num(z, nan=np.nanmin(z)); z = np.clip(z, 0, None)
    return lat[i0:i1:step][::-1], lon[j0:j1:step], z

def draw_topo(ax, km, ext, INK, zorder=0.6, rng=np.random.default_rng(3)):
    kx0, kx1, ky0, ky1 = ext
    LAT0, LON0, KX, KY = km.LAT0, km.LON0, km.KX, km.KY
    la0, la1 = LAT0 + ky0 / KY - .01, LAT0 + ky1 / KY + .01
    lo0, lo1 = LON0 + kx0 / KX - .01, LON0 + kx1 / KX + .01
    lat, lon, z = load_dem(la0, la1, lo0, lo1)
    X = (lon - LON0) * KX; Y = (lat - LAT0) * KY
    zs = gaussian_filter(z, 1.2)
    dx = X[1] - X[0]; dy = Y[1] - Y[0]
    gy, gx = np.gradient(zs, dy * 1000, dx * 1000)     # m/m
    # --- soft hillshade (shadows only, sepia)
    az, alt = math.radians(315), math.radians(40)
    slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
    sh = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
    shadow = np.clip((0.80 - sh) / 0.8, 0, 1) ** 1.1
    rgba = np.zeros(z.shape + (4,)); rgba[..., 0:3] = (0.30, 0.19, 0.09); rgba[..., 3] = shadow * 0.42
    ax.imshow(rgba, extent=(X[0], X[-1], Y[0], Y[-1]), origin="lower", zorder=zorder, interpolation="bilinear", aspect="auto")
    # --- contours (50 m, index 250 m)
    zc = gaussian_filter(z, 2.5)
    lv = np.arange(100, 1300, 50)
    cs = ax.contour(X, Y, zc, levels=[l for l in lv if l % 250], colors="#5b3d1f", linewidths=0.32, alpha=0.48, zorder=zorder + .1)
    cs.set_sketch_params(0.4, 40.0, 2.0)
    cs2 = ax.contour(X, Y, zc, levels=[l for l in lv if l % 250 == 0], colors="#4a2f17", linewidths=0.55, alpha=0.55, zorder=zorder + .1)
    cs2.set_sketch_params(0.4, 40.0, 2.0)
    lab = ax.clabel(cs2, fmt=lambda v: f"{int(v)}", fontsize=6.5, inline=True, inline_spacing=2, colors="#4a2f17")
    # --- hachures: short strokes along the fall line, denser/longer on steep slopes
    sp = 0.11
    xs = np.arange(kx0, kx1, sp); ys = np.arange(ky0, ky1, sp)
    segs, lws = [], []
    from scipy.interpolate import RegularGridInterpolator
    fgx = RegularGridInterpolator((Y, X), gx, bounds_error=False, fill_value=0)
    fgy = RegularGridInterpolator((Y, X), gy, bounds_error=False, fill_value=0)
    PX, PY = np.meshgrid(xs, ys); PX = PX + rng.uniform(-.035, .035, PX.shape); PY = PY + rng.uniform(-.035, .035, PY.shape)
    pts = np.c_[PY.ravel(), PX.ravel()]
    vx, vy = fgx(pts), fgy(pts); s = np.hypot(vx, vy)
    keep = s > 0.09
    for (py, px), ux, uy, sl in zip(pts[keep], vx[keep], vy[keep], s[keep]):
        L = 0.035 + min(sl, 0.45) / 0.45 * 0.075
        ux_, uy_ = -ux / sl, -uy / sl                     # downhill
        segs.append([(px - ux_ * L / 2, py - uy_ * L / 2), (px + ux_ * L / 2, py + uy_ * L / 2)])
        lws.append(0.25 + min(sl, 0.5) * 1.1)
    lc = LineCollection(segs, colors="#4a2f17", linewidths=lws, alpha=0.72, zorder=zorder + .2, capstyle="round")
    lc.set_sketch_params(0.3, 20.0, 2.0); ax.add_collection(lc)
    return X, Y, z

def wood_polys(path, km):
    els = json.load(open(path))["elements"]; out = []
    for e in els:
        t = e.get("tags", {}); kind = "scrub" if t.get("natural") in ("scrub", "heath") else "wood"
        if e["type"] == "way" and "geometry" in e:
            g = [km(p["lat"], p["lon"]) for p in e["geometry"]]
            if len(g) >= 4:
                p = SPoly(g).buffer(0)
                if not p.is_empty: out.append((kind, p))
        elif e["type"] == "relation":
            outer = [LineString([km(p["lat"], p["lon"]) for p in m["geometry"]]) for m in e.get("members", []) if m.get("role") == "outer" and m.get("geometry") and len(m["geometry"]) > 1]
            inner = [LineString([km(p["lat"], p["lon"]) for p in m["geometry"]]) for m in e.get("members", []) if m.get("role") == "inner" and m.get("geometry") and len(m["geometry"]) > 1]
            po = unary_union(list(polygonize(unary_union(outer))))
            if inner:
                pi = unary_union(list(polygonize(unary_union(inner))))
                po = po.difference(pi)
            if not po.is_empty: out.append((kind, po))
    return out

def draw_woods(ax, polys, ext, INK, zorder=1.2, rng=np.random.default_rng(11)):
    kx0, kx1, ky0, ky1 = ext
    trees, shrubs = [], []
    for kind, p in polys:
        geoms = getattr(p, "geoms", [p])
        for g in geoms:
            if g.geom_type != "Polygon" or g.area < 0.004: continue
            col = "#4b5a2f"
            ax.add_patch(Polygon(np.array(g.exterior.coords), closed=True, fc=col + ("26" if kind == "wood" else "14"), ec=col + "90", lw=0.45, zorder=zorder))
            sp = 0.20 if kind == "wood" else 0.30
            bx0, by0, bx1, by1 = g.bounds
            pg = prepared.prep(g.buffer(-0.03) if g.area > 0.02 else g)
            for xx in np.arange(bx0, bx1 + sp, sp):
                for yy in np.arange(by0, by1 + sp, sp * 0.87):
                    px = xx + (sp / 2 if int(round((yy - by0) / (sp * .87))) % 2 else 0) + rng.uniform(-.04, .04)
                    py = yy + rng.uniform(-.03, .03)
                    if not (kx0 < px < kx1 and ky0 < py < ky1): continue
                    if pg.contains(Point(px, py)): (trees if kind == "wood" else shrubs).append((px, py))
            if g.area < 0.03:
                c = g.representative_point(); (trees if kind == "wood" else shrubs).append((c.x, c.y))
    if trees:
        T = np.array(trees)
        ax.plot(np.c_[T[:, 0], T[:, 0], np.full(len(T), np.nan)].ravel(), np.c_[T[:, 1] - 0.055, T[:, 1] - 0.005, np.full(len(T), np.nan)].ravel(), color=INK, lw=0.7, zorder=zorder + .1)
        ax.scatter(T[:, 0], T[:, 1] + 0.012, s=22, marker="o", fc="#6f7f3f", ec=INK, lw=0.55, zorder=zorder + .2)
    if shrubs:
        Sh = np.array(shrubs)
        ax.scatter(Sh[:, 0], Sh[:, 1], s=7, marker="o", fc="#8a9455", ec=INK, lw=0.35, zorder=zorder + .2)
    return len(trees), len(shrubs)

def spot_heights(X, Y, z, region_box, min_sep_km=1.6, min_ele=250):
    zs = gaussian_filter(z, 1.0)
    n = max(3, int(min_sep_km / (X[1] - X[0])))
    mx = maximum_filter(zs, size=n)
    iy, ix = np.where((zs == mx) & (zs > min_ele))
    x0, x1, y0, y1 = region_box
    res = [(X[j], Y[i], z[i, j]) for i, j in zip(iy, ix) if x0 < X[j] < x1 and y0 < Y[i] < y1]
    return res
