from manim import *
import numpy as np
import math


# ==============================================================================
# EDUVISION SUBJECT-AWARE DETERMINISTIC VISUAL PRIMITIVES LIBRARY
# ==============================================================================
import math

# Vector & coordinate safety helpers
def vec3(x, y=0.0, z=0.0):
    """Guarantees a 3D float NumPy vector for Manim positioning."""
    return np.array([float(x), float(y), float(z)])

def deg_to_vec(degrees, length=1.0):
    """Creates a 3D unit direction vector from an angle in degrees."""
    rad = np.radians(degrees)
    return np.array([length * np.cos(rad), length * np.sin(rad), 0.0])

# Color safety aliases for commonly generated color names
LIGHT_GREEN = GREEN_B
DARK_GREEN = GREEN_E
LIGHT_BLUE = BLUE_B
DARK_BLUE = BLUE_E
LIGHT_RED = RED_B
DARK_RED = RED_E
LIGHT_YELLOW = YELLOW_B
DARK_YELLOW = YELLOW_E
LIGHT_GRAY = GRAY_B
DARK_GRAY = GRAY_D
CYAN = TEAL
MAGENTA = PINK
PURPLE_A = PURPLE
PURPLE_B = PURPLE

# Safe LaTeX fallback - automatically redirects MathTex and Tex to native Text
class SafeText(Text):
    def __init__(self, *args, **kwargs):
        kwargs.pop("tex_environment", None)
        kwargs.pop("tex_template", None)
        kwargs.pop("arg_separator", None)
        kwargs.pop("substrings_to_isolate", None)
        str_args = [str(a) for a in args] if args else [""]
        super().__init__(*str_args, **kwargs)

MathTex = SafeText
Tex = SafeText
SingleStringMathTex = SafeText


class LayoutManager:
    """Manages screen safe zones, clear-stage transitions, and auto-scales groups."""
    HEADER_Y = 3.2
    UPPER_LANE_Y = 1.8
    STAGE_Y = 0.0
    LOWER_LANE_Y = -1.8
    BOTTOM_Y = -3.2
    MAX_WIDTH = 11.2
    MAX_HEIGHT = 5.2

    @staticmethod
    def safe_scale(mob, max_w=11.2, max_h=5.2, *args, **kwargs):
        w = kwargs.get("max_w", kwargs.get("width", max_w))
        h = kwargs.get("max_h", kwargs.get("height", max_h))
        if mob.width > w and mob.width > 0:
            mob.scale_to_fit_width(w)
        if mob.height > h and mob.height > 0:
            mob.scale_to_fit_height(h)
        return mob

    @staticmethod
    def create_header(title_text="", subtitle_text="", *args, **kwargs):
        title = kwargs.get("title", kwargs.get("title_text", kwargs.get("text", kwargs.get("main", title_text))))
        sub = kwargs.get("sub", kwargs.get("subtitle", kwargs.get("subtitle_text", kwargs.get("sub_text", subtitle_text))))
        if not title and len(args) > 0:
            title = args[0]
            if len(args) > 1 and not sub:
                sub = args[1]
        t = Text(str(title or "EduVision"), font_size=32, color=BLUE_B).to_edge(UP, buff=0.35)
        if sub:
            st = Text(str(sub), font_size=18, color=GRAY_B).next_to(t, DOWN, buff=0.10)
            res = VGroup(t, st)
            return LayoutManager.safe_scale(res, max_w=11.0, max_h=1.2)
        return LayoutManager.safe_scale(t, max_w=11.0, max_h=1.0)

    @staticmethod
    def create_status_bar(text_str="", *args, **kwargs):
        color = kwargs.get("color", YELLOW)
        msg = kwargs.get("text", kwargs.get("text_str", kwargs.get("msg", kwargs.get("status", kwargs.get("label", text_str)))))
        if not msg and len(args) > 0:
            msg = args[0]
        txt = Text(str(msg or ""), font_size=19, color=color).to_edge(DOWN, buff=0.38)
        return LayoutManager.safe_scale(txt, max_w=11.2, max_h=0.8)

    @staticmethod
    def create_equation_card(equation_str="", label="", color=YELLOW, *args, **kwargs):
        eq = kwargs.get("eq", kwargs.get("equation", equation_str))
        lbl = kwargs.get("label", kwargs.get("lbl", label))
        col = kwargs.get("color", color)
        eq_txt = Text(str(eq), font_size=24, color=col)
        card_contents = [eq_txt]
        if lbl:
            lbl_txt = Text(str(lbl), font_size=14, color=GRAY_B).next_to(eq_txt, UP, buff=0.1)
            card_contents.insert(0, lbl_txt)
        inner = VGroup(*card_contents)
        box = SurroundingRectangle(inner, color=BLUE_D, fill_color="#0f172a", fill_opacity=0.9, buff=0.2, corner_radius=0.1)
        res = VGroup(box, inner)
        return LayoutManager.safe_scale(res, max_w=8.0, max_h=1.6)

    @staticmethod
    def clear_stage(scene, preserve=None, run_time=0.6, *args, **kwargs):
        """Fades out all active screen objects except preserved ones (e.g. the header)."""
        keep_list = []
        if preserve is not None:
            if isinstance(preserve, (list, tuple, set, VGroup, Group)):
                keep_list = list(preserve)
            else:
                keep_list = [preserve]
        to_fade = [m for m in list(scene.mobjects) if m not in keep_list and not any(m in getattr(k, 'submobjects', []) for k in keep_list)]
        if to_fade:
            scene.play(*[FadeOut(m) for m in to_fade], run_time=run_time)

# Equip Scene with anti-crash aliases, clear_stage, and wait safety
Scene.clear_stage = lambda self, preserve=None, run_time=0.6: LayoutManager.clear_stage(self, preserve, run_time)
Scene.scene1 = lambda self, *args, **kwargs: None
Scene.scene2 = lambda self, *args, **kwargs: None
Scene.scene3 = lambda self, *args, **kwargs: None
Scene.scene4 = lambda self, *args, **kwargs: None

_orig_scene_wait = getattr(Scene, "wait", None)
def _safe_scene_wait(self, duration=1.0, *args, **kwargs):
    try:
        dur = float(duration)
        if dur <= 0.001:
            return
        if _orig_scene_wait:
            return _orig_scene_wait(self, dur, *args, **kwargs)
    except Exception:
        pass
Scene.wait = _safe_scene_wait
Scene.safe_wait = _safe_scene_wait

# Monkeypatch Mobject.next_to to accept hallucinated 'buffer' keyword safely
_orig_next_to = Mobject.next_to
def _safe_next_to(self, target, direction=DOWN, *args, **kwargs):
    if "buffer" in kwargs and "buff" not in kwargs:
        kwargs["buff"] = kwargs.pop("buffer")
    return _orig_next_to(self, target, direction, *args, **kwargs)
Mobject.next_to = _safe_next_to


class ArrayVisualizer:
    """Deterministic boxed array visualizer with values, indices, and pointer lanes."""
    def __init__(self, values=None, box_size=0.8, color=BLUE_D, font_size=22, show_indices=True, *args, **kwargs):
        vals = values
        if vals is None and len(args) > 0:
            vals = args[0]
        vals = kwargs.get("values", kwargs.get("array", kwargs.get("arr", vals or [])))
        
        self.values = vals
        self.box_size = kwargs.get("box_size", box_size)
        c = kwargs.get("color", color)
        fs = kwargs.get("font_size", font_size)
        si = kwargs.get("show_indices", show_indices)

        self.boxes = []
        self.val_texts = []
        self.idx_texts = []
        self.group = VGroup()

        for i, val in enumerate(self.values):
            sq = Square(side_length=self.box_size, color=c, fill_color="#0f172a", fill_opacity=0.85, stroke_width=2.5)
            num = Text(str(val), font_size=fs, color=WHITE).move_to(sq.get_center())
            self.boxes.append(sq)
            self.val_texts.append(num)
            
            elem_grp = VGroup(sq, num)
            if si:
                idx = Text(str(i), font_size=14, color=GRAY).next_to(sq, UP, buff=0.12)
                self.idx_texts.append(idx)
                elem_grp.add(idx)
            self.group.add(elem_grp)

        self.group.arrange(RIGHT, buff=0.08)
        LayoutManager.safe_scale(self.group)

    def get_group(self):
        return self.group

    def get_element(self, idx):
        return self.group[idx]

    def get_box(self, idx):
        return self.boxes[idx]

    def get_val_mob(self, idx):
        return self.val_texts[idx]

    def create_pointer(self, idx, label="", is_upper=False, color=YELLOW, *args, **kwargs):
        lbl_text = kwargs.get("label", kwargs.get("text", label))
        if not lbl_text and len(args) > 0:
            lbl_text = args[0]
        up = kwargs.get("is_upper", kwargs.get("upper", is_upper))
        col = kwargs.get("color", color)

        target_box = self.boxes[idx]
        if up:
            ptr = Arrow(UP*0.75, UP*0.08, color=col, stroke_width=3).next_to(target_box, UP, buff=0.35)
            lbl = Text(str(lbl_text), font_size=14, color=col).next_to(ptr, UP, buff=0.08)
        else:
            ptr = Arrow(DOWN*0.75, DOWN*0.08, color=col, stroke_width=3).next_to(target_box, DOWN, buff=0.15)
            lbl = Text(str(lbl_text), font_size=14, color=col).next_to(ptr, DOWN, buff=0.08)
        return VGroup(ptr, lbl)


class LinkedListVisualizer:
    """Deterministic Singly Linked List Node and Pointer visualizer."""
    def __init__(self, values=None, node_w=1.2, node_h=0.7, color=BLUE_B, *args, **kwargs):
        vals = values
        if vals is None and len(args) > 0:
            vals = args[0]
        vals = kwargs.get("values", kwargs.get("nodes", vals or []))

        nw = kwargs.get("node_w", kwargs.get("width", node_w))
        nh = kwargs.get("node_h", kwargs.get("height", node_h))
        col = kwargs.get("color", color)

        self.nodes = []
        self.arrows = []
        self.group = VGroup()

        for i, val in enumerate(vals):
            data_box = Rectangle(width=nw*0.65, height=nh, color=col, fill_color="#0f172a", fill_opacity=0.9, stroke_width=2)
            ptr_box = Rectangle(width=nw*0.35, height=nh, color=col, fill_color="#1e293b", fill_opacity=0.9, stroke_width=2).next_to(data_box, RIGHT, buff=0)
            dot = Dot(ptr_box.get_center(), radius=0.06, color=YELLOW)
            val_txt = Text(str(val), font_size=18, color=WHITE).move_to(data_box.get_center())
            
            node_grp = VGroup(data_box, ptr_box, dot, val_txt)
            self.nodes.append(node_grp)

        for i in range(len(self.nodes)):
            if i > 0:
                self.nodes[i].next_to(self.nodes[i-1], RIGHT, buff=0.8)
                arr = Arrow(self.nodes[i-1][2].get_center(), self.nodes[i][0].get_left(), color=YELLOW, buff=0.05, stroke_width=2.5)
                self.arrows.append(arr)
                self.group.add(arr)
            self.group.add(self.nodes[i])

        if len(self.nodes) > 0:
            null_txt = Text("NULL", font_size=16, color=GRAY_B).next_to(self.nodes[-1], RIGHT, buff=0.8)
            last_arr = Arrow(self.nodes[-1][2].get_center(), null_txt.get_left(), color=GRAY, buff=0.05, stroke_width=2)
            self.group.add(last_arr, null_txt)
        
        self.group.move_to(ORIGIN)
        LayoutManager.safe_scale(self.group)

    def get_group(self):
        return self.group

    def get_node(self, idx):
        if isinstance(idx, int) and 0 <= idx < len(self.nodes):
            return self.nodes[idx]
        return VGroup()


class TreeVisualizer:
    """Hierarchical Binary Tree visualizer with non-overlapping subtree coordinates."""
    def __init__(self, root_val=None, tree_dict=None, radius=0.35, level_h=1.2, *args, **kwargs):
        self.nodes = {}
        self.edges = VGroup()
        self.node_group = VGroup()

        t_dict = kwargs.get("tree_dict", kwargs.get("tree", tree_dict))
        tree_data = t_dict or (root_val if isinstance(root_val, dict) else {"root": root_val or 10})
        r = kwargs.get("radius", radius)

        # Deterministic positions
        positions = {
            "root": np.array([0, 1.6, 0]),
            "L": np.array([-2.5, 0.4, 0]),
            "R": np.array([2.5, 0.4, 0]),
            "LL": np.array([-3.8, -0.8, 0]),
            "LR": np.array([-1.4, -0.8, 0]),
            "RL": np.array([1.4, -0.8, 0]),
            "RR": np.array([3.8, -0.8, 0]),
        }

        for key, pos in positions.items():
            if key in tree_data:
                val = tree_data[key]
                c = Circle(radius=r, color=BLUE_B, fill_color="#0f172a", fill_opacity=1.0, stroke_width=2.5).move_to(pos)
                t = Text(str(val), font_size=18, color=WHITE).move_to(pos)
                node_mob = VGroup(c, t)
                self.nodes[key] = node_mob
                self.node_group.add(node_mob)

        # Edges behind nodes
        edge_links = [("root", "L"), ("root", "R"), ("L", "LL"), ("L", "LR"), ("R", "RL"), ("R", "RR")]
        for p, ch in edge_links:
            if p in self.nodes and ch in self.nodes:
                line = Line(self.nodes[p][0].get_center(), self.nodes[ch][0].get_center(), color="#334155", stroke_width=3)
                self.edges.add(line)

        self.group = VGroup(self.edges, self.node_group)
        LayoutManager.safe_scale(self.group)

    def get_group(self):
        return self.group

    def get_node(self, key):
        return self.nodes.get(str(key), self.nodes.get(key, VGroup()))


class GraphVisualizer:
    """Deterministic Graph Visualizer ensuring edges are rendered behind nodes."""
    def __init__(self, positions_dict=None, edge_pairs=None, radius=0.38, *args, **kwargs):
        pos_dict = positions_dict
        if pos_dict is None and len(args) > 0:
            pos_dict = args[0]
        pos_dict = kwargs.get("positions", kwargs.get("positions_dict", kwargs.get("nodes", pos_dict or {})))

        edges = edge_pairs
        if edges is None and len(args) > 1:
            edges = args[1]
        edges = kwargs.get("edges", kwargs.get("edge_pairs", edges or []))

        r = kwargs.get("radius", radius)

        self.positions = pos_dict
        self.nodes = {}
        self.node_group = VGroup()
        self.edges = VGroup()

        # Edges
        for edge in edges:
            if isinstance(edge, (list, tuple)) and len(edge) >= 2:
                u, v = edge[0], edge[1]
                if u in pos_dict and v in pos_dict:
                    line = Line(pos_dict[u], pos_dict[v], color="#334155", stroke_width=3)
                    self.edges.add(line)

        # Nodes
        for name, pos in pos_dict.items():
            c = Circle(radius=r, color=BLUE_B, fill_color="#0f172a", fill_opacity=1.0, stroke_width=2.5).move_to(pos)
            t = Text(str(name), font_size=18, color=WHITE).move_to(pos)
            node_mob = VGroup(c, t)
            self.nodes[name] = node_mob
            self.node_group.add(node_mob)

        self.group = VGroup(self.edges, self.node_group)
        LayoutManager.safe_scale(self.group)

    def get_group(self):
        return self.group

    def get_node(self, name):
        return self.nodes.get(str(name), self.nodes.get(name, VGroup()))

    def get_nodes(self):
        return self.node_group

    def get_edges(self):
        return self.edges

    def set_visited(self, name, color=GREEN, *args, **kwargs):
        col = kwargs.get("color", color)
        target = self.get_node(name)
        if target and len(target) > 0:
            return target[0].animate.set_fill(col, opacity=0.85).set_color(col)
        return FadeIn(VGroup())


class KinematicsVisualizer:
    """Deterministic Kinematics & Projectile Visualizer with attached vectors."""
    @staticmethod
    def create_canvas(x_max=10, y_max=6, x_len=8.5, y_len=4.2, *args, **kwargs):
        xm = kwargs.get("x_max", x_max)
        ym = kwargs.get("y_max", y_max)
        xl = kwargs.get("x_len", kwargs.get("x_length", x_len))
        yl = kwargs.get("y_len", kwargs.get("y_length", y_len))

        axes = Axes(
            x_range=[0, xm, 2],
            y_range=[0, ym, 2],
            x_length=xl,
            y_length=yl,
            axis_config={"color": BLUE_D, "stroke_width": 2, "include_numbers": False},
        ).shift(LEFT * 0.5 + DOWN * 0.9)
        ground = Line(axes.c2p(-0.5, 0), axes.c2p(xm+0.5, 0), color=GRAY_D, stroke_width=3)
        return axes, ground


class MoleculeVisualizer:
    """Deterministic particle & chemical bond visualizer."""
    @staticmethod
    def make_atom(symbol="H", color=BLUE, radius=0.3, font_size=18, *args, **kwargs):
        sym = kwargs.get("symbol", symbol)
        col = kwargs.get("color", color)
        r = kwargs.get("radius", radius)
        fs = kwargs.get("font_size", font_size)

        c = Circle(radius=r, color=col, fill_color=col, fill_opacity=0.85, stroke_width=2)
        t = Text(str(sym), font_size=fs, color=WHITE).move_to(c.get_center())
        return VGroup(c, t)

    @staticmethod
    def make_bond(atom1, atom2, color=GRAY, stroke_width=2.5, *args, **kwargs):
        col = kwargs.get("color", color)
        sw = kwargs.get("stroke_width", stroke_width)
        return Line(atom1.get_center(), atom2.get_center(), color=col, stroke_width=sw)


class CircuitVisualizer:
    """Deterministic Electric Circuit visualizer with voltage source and resistor."""
    @staticmethod
    def create_rc_circuit(voltage=12, resistance=4, current=None, width=6.0, height=3.0, *args, **kwargs):
        v = kwargs.get("voltage", kwargs.get("v", voltage))
        r = kwargs.get("resistance", kwargs.get("r", resistance))
        w = kwargs.get("width", kwargs.get("w", width))
        h = kwargs.get("height", kwargs.get("h", height))

        loop = Rectangle(width=w, height=h, color=BLUE_D, stroke_width=3)
        
        # Source on left
        v_src = Circle(radius=0.42, color=YELLOW, fill_color="#0f172a", fill_opacity=1.0, stroke_width=2.5).move_to(loop.get_left())
        v_lbl = Text(f"{v}V", font_size=16, color=YELLOW).move_to(v_src.get_center())
        v_group = VGroup(v_src, v_lbl)

        # Resistor on top
        r_box = Rectangle(width=1.4, height=0.48, color=GREEN_B, fill_color="#0f172a", fill_opacity=1.0, stroke_width=2.5).move_to(loop.get_top())
        r_lbl = Text(f"{r} Ω", font_size=16, color=GREEN_B).move_to(r_box.get_center())
        r_group = VGroup(r_box, r_lbl)

        # Current Arrow on right
        calc_i = current if current is not None else kwargs.get("current", kwargs.get("i", round(float(v) / float(r), 1)))
        i_arrow = Arrow(loop.get_right() + UP*0.7, loop.get_right() + DOWN*0.7, color=ORANGE, stroke_width=3.5)
        i_lbl = Text(f"I = {calc_i}A", font_size=16, color=ORANGE).next_to(i_arrow, RIGHT, buff=0.15)
        i_group = VGroup(i_arrow, i_lbl)

        return VGroup(loop, v_group, r_group, i_group)


class MatrixVisualizer:
    """Deterministic Matrix Visualizer with row/column highlights."""
    @staticmethod
    def create_matrix(matrix_vals=None, font_size=20, cell_size=0.7, *args, **kwargs):
        m = matrix_vals
        if m is None and len(args) > 0:
            m = args[0]
        m = kwargs.get("matrix_vals", kwargs.get("matrix", kwargs.get("vals", m or [[1, 0], [0, 1]])))

        fs = kwargs.get("font_size", font_size)
        cs = kwargs.get("cell_size", cell_size)

        grp = VGroup()
        rows = len(m)
        cols = len(m[0])
        cells = []
        for r in range(rows):
            row_cells = []
            for c in range(cols):
                sq = Square(side_length=cs, color=BLUE_D, fill_color="#0f172a", fill_opacity=0.85, stroke_width=2)
                val = Text(str(m[r][c]), font_size=fs, color=WHITE).move_to(sq.get_center())
                cell = VGroup(sq, val)
                row_cells.append(cell)
            row_grp = VGroup(*row_cells).arrange(RIGHT, buff=0.05)
            cells.append(row_grp)
        grid = VGroup(*cells).arrange(DOWN, buff=0.05)
        brackets = SurroundingRectangle(grid, color=BLUE_B, buff=0.12, stroke_width=2)
        return VGroup(grid, brackets)


class OpticsVisualizer:
    """Deterministic Optics, Mirror & Lens Visualizer."""
    @staticmethod
    def create_plane_mirror(length=7.5, position=DOWN*1.0, *args, **kwargs):
        p = position
        mirror_line = Line(p + LEFT*(length/2), p + RIGHT*(length/2), color=BLUE_B, stroke_width=4)
        hatch_points = np.linspace(p + LEFT*(length/2), p + RIGHT*(length/2), int(length * 3))
        hatches = VGroup(*[Line(pt, pt + DL*0.2, color=GRAY, stroke_width=2) for pt in hatch_points])
        normal = DashedLine(p, p + UP*3.2, color=GRAY_B, stroke_width=2)
        normal_lbl = Text("Normal", font_size=16, color=GRAY_B).next_to(normal.get_top(), UR, buff=0.1)
        return VGroup(mirror_line, hatches, normal, normal_lbl)

    @staticmethod
    def create_concave_lens(height=4.5, focal_length=2.5, *args, **kwargs):
        """Creates a concave (diverging) lens with optical axis and focal points."""
        axis = Line(LEFT*6, RIGHT*6, color=GRAY_D, stroke_width=2)
        lens_line = Line(UP*(height/2), DOWN*(height/2), color=BLUE_B, stroke_width=4)
        t_arr = Arrow(UP*(height/2) + UP*0.3, UP*(height/2), color=BLUE_B, buff=0, stroke_width=3)
        b_arr = Arrow(DOWN*(height/2) + DOWN*0.3, DOWN*(height/2), color=BLUE_B, buff=0, stroke_width=3)
        f_left = Dot(LEFT*focal_length, radius=0.07, color=YELLOW)
        f_left_lbl = Text("F₁", font_size=16, color=YELLOW).next_to(f_left, DOWN, buff=0.1)
        f_right = Dot(RIGHT*focal_length, radius=0.07, color=YELLOW)
        f_right_lbl = Text("F₂", font_size=16, color=YELLOW).next_to(f_right, DOWN, buff=0.1)
        o_pt = Dot(ORIGIN, radius=0.06, color=WHITE)
        o_lbl = Text("O", font_size=14, color=WHITE).next_to(o_pt, DR, buff=0.06)
        return VGroup(axis, lens_line, t_arr, b_arr, f_left, f_left_lbl, f_right, f_right_lbl, o_pt, o_lbl)

    @staticmethod
    def create_concave_mirror(radius=3.5, arc_angle=PI/2.5, *args, **kwargs):
        """Creates a concave curved spherical mirror with center of curvature C and focus F."""
        axis = Line(LEFT*6, RIGHT*6, color=GRAY_D, stroke_width=2)
        mirror_arc = Arc(radius=radius, start_angle=-arc_angle/2, angle=arc_angle, color=BLUE_B, stroke_width=4).shift(RIGHT*2.5)
        f_pt = Dot(RIGHT*(2.5 - radius/2), radius=0.07, color=YELLOW)
        f_lbl = Text("F", font_size=16, color=YELLOW).next_to(f_pt, DOWN, buff=0.1)
        c_pt = Dot(RIGHT*(2.5 - radius), radius=0.07, color=BLUE_B)
        c_lbl = Text("C", font_size=16, color=BLUE_B).next_to(c_pt, DOWN, buff=0.1)
        return VGroup(axis, mirror_arc, f_pt, f_lbl, c_pt, c_lbl)


class BioChemVisualizer:
    """Deterministic Biology & Chemistry visualizer for reactions, cells, and processes."""
    @staticmethod
    def create_chemical_reaction(reactants="6 CO₂ + 6 H₂O", products="C₆H₁₂O₆ + 6 O₂", catalyst="Light & Chlorophyll"):
        r_txt = Text(str(reactants), font_size=20, color=GREEN_B)
        arr = Arrow(LEFT*1.0, RIGHT*1.0, color=YELLOW, stroke_width=3)
        cat_txt = Text(str(catalyst), font_size=13, color=YELLOW_B).next_to(arr, UP, buff=0.08)
        p_txt = Text(str(products), font_size=20, color=BLUE_B)
        
        arr_group = VGroup(arr, cat_txt)
        r_txt.next_to(arr_group, LEFT, buff=0.3)
        p_txt.next_to(arr_group, RIGHT, buff=0.3)
        reaction_group = VGroup(r_txt, arr_group, p_txt)
        return LayoutManager.safe_scale(reaction_group, max_w=10.5, max_h=1.8)

    @staticmethod
    def create_action_reaction_pair(action_text="Action: Force on Object B", reaction_text="Reaction: Equal & Opposite on Object A"):
        act = Text(str(action_text), font_size=18, color=YELLOW)
        react = Text(str(reaction_text), font_size=18, color=ORANGE)
        act_arr = Arrow(LEFT*2.0, RIGHT*2.0, color=YELLOW, stroke_width=3.5).next_to(act, DOWN, buff=0.15)
        react_arr = Arrow(RIGHT*2.0, LEFT*2.0, color=ORANGE, stroke_width=3.5).next_to(react, DOWN, buff=0.15)
        g1 = VGroup(act, act_arr)
        g2 = VGroup(react, react_arr).next_to(g1, DOWN, buff=0.4)
        return VGroup(g1, g2)


class AutoTeach(Scene):
    def construct(self):
        self.camera.background_color = "#070b14"

        # ---------- Header (persistent) ----------
        header = LayoutManager.create_header(
            title_text="Merge Sort",
            subtitle_text="Divide‑and‑Conquer Sorting"
        )
        self.play(FadeIn(header, shift=UP), run_time=0.5)

        # Helper to create a bar (rectangle + label) for a given value
        def make_bar(value, idx, total, color=BLUE_D):
            # Width and spacing
            width = 0.8
            spacing = 1.0
            # Height proportional to value (scale factor 0.07 for visual comfort)
            height = 0.07 * value
            rect = Rectangle(width=width, height=height, fill_color=color, fill_opacity=0.8, stroke_width=1)
            # Position horizontally centered
            start_x = - (total - 1) * spacing / 2
            rect.move_to(np.array([start_x + idx * spacing, 0, 0]))
            # Text label on top of the bar
            label = Text(str(value), font_size=24, color=WHITE)
            label.next_to(rect, UP, buff=0.15)
            return VGroup(rect, label)

        # ---------- SCENE 1 ----------
        # Clear stage (nothing to preserve besides header)
        LayoutManager.clear_stage(self, preserve=header)

        raw_vals = [38, 27, 43, 3, 9, 82, 10]
        raw_bars = VGroup(*[make_bar(v, i, len(raw_vals)) for i, v in enumerate(raw_vals)])
        raw_bars = LayoutManager.safe_scale(raw_bars, max_w=11.2, max_h=5.2)

        status1 = LayoutManager.create_status_bar(
            "Unsorted array: " + ", ".join(map(str, raw_vals)),
            color=YELLOW
        )
        self.play(FadeIn(raw_bars, shift=UP), run_time=2.0)
        self.play(FadeIn(status1, shift=UP), run_time=0.5)
        self.wait(6.2)  # total 8.7 seconds

        # ---------- SCENE 2 ----------
        LayoutManager.clear_stage(self, preserve=header)

        # Re‑create raw array for this scene
        raw_bars2 = VGroup(*[make_bar(v, i, len(raw_vals)) for i, v in enumerate(raw_vals)])
        raw_bars2 = LayoutManager.safe_scale(raw_bars2, max_w=11.2, max_h=5.2)

        status2 = LayoutManager.create_status_bar(
            "Splitting the array recursively",
            color=YELLOW
        )
        self.play(FadeIn(raw_bars2, shift=UP), run_time=1.5)
        self.play(FadeIn(status2, shift=UP), run_time=0.5)

        # Split arrow (double arrow) indicating division into left/right halves
        split_arrow = DoubleArrow(
            start=raw_bars2.get_center() + np.array([-2, -1, 0]),
            end=raw_bars2.get_center() + np.array([2, -1, 0]),
            buff=0.2,
            color=GREEN
        )
        split_label = Text("Split", font_size=24, color=GREEN)
        split_label.next_to(split_arrow, DOWN, buff=0.2)

        self.play(FadeIn(split_arrow, shift=UP), FadeIn(split_label, shift=UP), run_time=0.8)

        # Create left and right halves (copies of the relevant bars)
        left_vals = [38, 27]
        right_vals = [43, 3]
        left_half = VGroup(*[make_bar(v, i, len(left_vals), color=BLUE_E) for i, v in enumerate(left_vals)])
        right_half = VGroup(*[make_bar(v, i, len(right_vals), color=BLUE_E) for i, v in enumerate(right_vals)])

        # Position halves below the original array
        left_half.move_to(np.array([-3, -2.5, 0]))
        right_half.move_to(np.array([3, -2.5, 0]))

        # Transform raw array into halves (fade out raw, fade in halves)
        self.play(
            ReplacementTransform(raw_bars2, VGroup(left_half, right_half)),
            run_time=1.2
        )

        # Further split each half into singletons
        split_arrow2 = DoubleArrow(
            start=left_half.get_center() + np.array([-1, -1, 0]),
            end=left_half.get_center() + np.array([1, -1, 0]),
            buff=0.2,
            color=GREEN
        )
        split_arrow3 = DoubleArrow(
            start=right_half.get_center() + np.array([-1, -1, 0]),
            end=right_half.get_center() + np.array([1, -1, 0]),
            buff=0.2,
            color=GREEN
        )
        self.play(FadeIn(split_arrow2, shift=UP), FadeIn(split_arrow3, shift=UP), run_time=0.8)

        # Singletons (each bar moved down)
        singleton_groups = VGroup()
        for i, val in enumerate(left_vals):
            bar = make_bar(val, 0, 1, color=BLUE_A)
            bar.move_to(np.array([-4 + i*2, -5, 0]))
            singleton_groups.add(bar)
        for i, val in enumerate(right_vals):
            bar = make_bar(val, 0, 1, color=BLUE_A)
            bar.move_to(np.array([-4 + i*2, -5, 0]))
            singleton_groups.add(bar)

        self.play(
            ReplacementTransform(VGroup(left_half, right_half), singleton_groups),
            run_time=1.2
        )
        self.wait(3.1)  # total 8.6 seconds

        # ---------- SCENE 3 ----------
        LayoutManager.clear_stage(self, preserve=header)

        # Show the four singletons again
        single_vals = [38, 27, 43, 3]
        singletons = VGroup(*[make_bar(v, i, len(single_vals), color=BLUE_A) for i, v in enumerate(single_vals)])
        # Position them in two rows for clarity
        for i, bar in enumerate(singletons):
            row = 0 if i < 2 else -2
            col = -2 + (i % 2) * 4
            bar.move_to(np.array([col, row, 0]))
        singletons = LayoutManager.safe_scale(singletons, max_w=11.2, max_h=5.2)

        status3 = LayoutManager.create_status_bar(
            "Merging neighboring singletons",
            color=YELLOW
        )
        self.play(FadeIn(singletons, shift=UP), run_time=1.5)
        self.play(FadeIn(status3, shift=UP), run_time=0.5)

        # Highlight first pair [38] & [27]
        highlight1 = SurroundingRectangle(VGroup(singletons[0], singletons[1]), color=YELLOW, buff=0.2)
        self.play(FadeIn(highlight1), run_time=0.6)

        # Merge first pair into sorted [27,38]
        merged_left = VGroup(*[make_bar(v, i, 2, color=BLUE_E) for i, v in enumerate([27, 38])])
        merged_left.arrange(RIGHT, buff=0.5)
        merged_left.move_to(singletons[0].get_center() + np.array([0, -1, 0]))

        self.play(
            ReplacementTransform(VGroup(singletons[0], singletons[1]), merged_left),
            FadeOut(highlight1),
            run_time=1.0
        )

        # Highlight second pair [43] & [3]
        highlight2 = SurroundingRectangle(VGroup(singletons[2], singletons[3]), color=YELLOW, buff=0.2)
        self.play(FadeIn(highlight2), run_time=0.6)

        # Merge second pair into sorted [3,43]
        merged_right = VGroup(*[make_bar(v, i, 2, color=BLUE_E) for i, v in enumerate([3, 43])])
        merged_right.arrange(RIGHT, buff=0.5)
        merged_right.move_to(singletons[2].get_center() + np.array([0, -1, 0]))

        self.play(
            ReplacementTransform(VGroup(singletons[2], singletons[3]), merged_right),
            FadeOut(highlight2),
            run_time=1.0
        )
        self.wait(4.6)  # total 7.8 seconds

        # ---------- SCENE 4 ----------
        LayoutManager.clear_stage(self, preserve=header)

        # Show the two sorted halves ready to merge
        left_sorted = merged_left.copy()
        right_sorted = merged_right.copy()
        left_sorted.move_to(np.array([-2, 0, 0]))
        right_sorted.move_to(np.array([2, 0, 0]))

        status4 = LayoutManager.create_status_bar(
            "Final merge of sorted halves",
            color=YELLOW
        )
        self.play(FadeIn(VGroup(left_sorted, right_sorted), shift=UP), run_time=1.5)
        self.play(FadeIn(status4, shift=UP), run_time=0.5)

        # Merge arrow indicating final combination
        final_merge_arrow = DoubleArrow(
            start=left_sorted.get_center() + np.array([0, -1, 0]),
            end=right_sorted.get_center() + np.array([0, -1, 0]),
            buff=0.2,
            color=GREEN
        )
        final_merge_label = Text("Merge", font_size=24, color=GREEN)
        final_merge_label.next_to(final_merge_arrow, DOWN, buff=0.2)

        self.play(FadeIn(final_merge_arrow, shift=UP), FadeIn(final_merge_label, shift=UP), run_time=0.8)

        # Final sorted result [3,27,38,43]
        final_vals = [3, 27, 38, 43]
        final_array = VGroup(*[make_bar(v, i, len(final_vals), color=BLUE_D) for i, v in enumerate(final_vals)])
        final_array.arrange(RIGHT, buff=0.5)
        final_array.move_to(np.array([0, -2, 0]))

        self.play(
            ReplacementTransform(VGroup(left_sorted, right_sorted), final_array),
            FadeOut(final_merge_arrow),
            FadeOut(final_merge_label),
            run_time=1.5
        )
        self.wait(7.8)  # total 10.1 seconds