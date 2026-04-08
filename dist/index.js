import { ExternalTokenizer as T, ContextTracker as Ie, LRParser as Me } from "@lezer/lr";
import { styleTags as Ke, tags as l } from "@lezer/highlight";
import { syntaxTree as Z, indentNodeProp as De, LRLanguage as Ge, foldNodeProp as Fe, LanguageSupport as Je } from "@codemirror/language";
import { cssLanguage as He, css as Le } from "@codemirror/lang-css";
import { javascriptLanguage as L, typescriptLanguage as ze, javascript as et } from "@codemirror/lang-javascript";
import { EditorSelection as re } from "@codemirror/state";
import { EditorView as tt } from "@codemirror/view";
import { parseMixed as Ot } from "@lezer/common";
import { snippetCompletion as V } from "@codemirror/autocomplete";
import { htmlCompletionSource as nt } from "@codemirror/lang-html";
const at = 156, rt = 1, ot = 157, lt = 2, st = 158, it = 3, U = 4, Ve = 5, Pe = 6, Te = 7, xe = 8, pt = 9, ct = 11, I = 159, $t = 12, oe = 160, D = 13, G = 14, Y = 15, bt = 75, ht = 118, ut = 121, wt = 124, ft = 126, dt = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
  "menuitem",
  // SVG self-closing tags
  "circle",
  "ellipse",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "use"
]), St = /* @__PURE__ */ new Set([
  "dd",
  "li",
  "optgroup",
  "option",
  "p",
  "rp",
  "rt",
  "tbody",
  "td",
  "tfoot",
  "th",
  "tr"
]), qt = /* @__PURE__ */ new Map([
  ["dd", /* @__PURE__ */ new Set(["dd", "dt"])],
  ["dt", /* @__PURE__ */ new Set(["dd", "dt"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["option", /* @__PURE__ */ new Set(["option", "optgroup"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup"])],
  [
    "p",
    /* @__PURE__ */ new Set([
      "address",
      "article",
      "aside",
      "blockquote",
      "dir",
      "div",
      "dl",
      "fieldset",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "hr",
      "menu",
      "nav",
      "ol",
      "p",
      "pre",
      "section",
      "table",
      "ul"
    ])
  ],
  ["rp", /* @__PURE__ */ new Set(["rp", "rt"])],
  ["rt", /* @__PURE__ */ new Set(["rp", "rt"])],
  ["tbody", /* @__PURE__ */ new Set(["tbody", "tfoot"])],
  ["td", /* @__PURE__ */ new Set(["td", "th"])],
  ["tfoot", /* @__PURE__ */ new Set(["tbody"])],
  ["th", /* @__PURE__ */ new Set(["td", "th"])],
  ["thead", /* @__PURE__ */ new Set(["tbody", "tfoot"])],
  ["tr", /* @__PURE__ */ new Set(["tr"])]
]);
function mt(e) {
  return e == 45 || e == 46 || e == 58 || e >= 65 && e <= 90 || e == 95 || e >= 97 && e <= 122 || e >= 161;
}
function Qe(e) {
  return e == 9 || e == 10 || e == 13 || e == 32;
}
let le = null, se = null, ie = 0;
function F(e, t) {
  const O = e.pos + t;
  if (ie === O && se === e)
    return le;
  let n = e.peek(t);
  for (; Qe(n); ) n = e.peek(++t);
  let a = "";
  for (; mt(n); )
    a += String.fromCharCode(n), n = e.peek(++t);
  return se = e, ie = O, le = a, a ? /^[A-Z]/.test(a) ? a : a.toLowerCase() : n === vt || n === Vt ? void 0 : null;
}
const ye = 60, gt = 62, We = 47, vt = 63, Vt = 33;
class M {
  name;
  parent;
  constructor(t, O) {
    this.name = t, this.parent = O;
  }
}
const Pt = /* @__PURE__ */ new Set([
  U,
  xe,
  Ve,
  Pe,
  Te
]), Tt = new Ie({
  start: null,
  shift(e, t, O, n) {
    return Pt.has(t) ? new M(F(n, 1) ?? "", e) : e;
  },
  reduce(e, t) {
    return t === bt && e ? e.parent ?? new M("", null) : e;
  },
  reuse(e, t, O, n) {
    const a = t.type.id;
    return a === U || a === ft ? new M(F(n, 1) ?? "", e) : e;
  },
  strict: !1
}), xt = new T(
  (e, t) => {
    const O = e.next;
    if (O !== ye) {
      O < 0 && t.context && e.acceptToken(I);
      return;
    }
    e.advance();
    const a = e.next === We;
    a && e.advance();
    const r = F(e, 0);
    if (r === void 0)
      return;
    if (!r) {
      e.acceptToken(a ? $t : U);
      return;
    }
    const o = t.context ? t.context.name : null;
    if (a) {
      if (r === o) {
        e.acceptToken(pt);
        return;
      }
      if (o && St.has(o)) {
        e.acceptToken(I, -2);
        return;
      }
      for (let s = t.context; s; s = s.parent)
        if (s.name === r)
          return;
      e.acceptToken(ct);
      return;
    }
    if (r === "script") {
      e.acceptToken(Ve);
      return;
    }
    if (r === "style") {
      e.acceptToken(Pe);
      return;
    }
    if (r === "textarea") {
      e.acceptToken(Te);
      return;
    }
    if (dt.has(r)) {
      e.acceptToken(xe);
      return;
    }
    o && qt.get(o)?.has(r) ? e.acceptToken(I, -1) : e.acceptToken(U);
  },
  { contextual: !0 }
);
function z(e, t, O) {
  const n = 2 + e.length;
  return new T((a) => {
    for (let r = 0, o = 0, s = 0; ; s++) {
      if (a.next < 0) {
        s && a.acceptToken(t);
        break;
      }
      if (r === 0 && a.next === ye || r === 1 && a.next === We || r >= 2 && r < n && a.next === e.charCodeAt(r - 2))
        r++, o++;
      else if ((r === 2 || r === n) && Qe(a.next))
        o++;
      else if (r === n && a.next === gt) {
        s > o ? a.acceptToken(t, -o) : a.acceptToken(O, -(o - 2));
        break;
      } else if ((a.next == 10 || a.next == 13) && s) {
        a.acceptToken(t, 1);
        break;
      } else
        r = o = 0;
      a.advance();
    }
  });
}
const Qt = z("script", at, rt), yt = z("style", ot, lt), Wt = z("textarea", st, it), d = /* @__PURE__ */ Symbol.for("@ts-pattern/matcher"), kt = /* @__PURE__ */ Symbol.for("@ts-pattern/isVariadic"), X = "@ts-pattern/anonymous-select-key", J = (e) => !!(e && typeof e == "object"), _ = (e) => e && !!e[d], f = (e, t, O) => {
  if (_(e)) {
    const n = e[d](), { matched: a, selections: r } = n.match(t);
    return a && r && Object.keys(r).forEach((o) => O(o, r[o])), a;
  }
  if (J(e)) {
    if (!J(t)) return !1;
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) return !1;
      let n = [], a = [], r = [];
      for (const o of e.keys()) {
        const s = e[o];
        _(s) && s[kt] ? r.push(s) : r.length ? a.push(s) : n.push(s);
      }
      if (r.length) {
        if (r.length > 1) throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
        if (t.length < n.length + a.length) return !1;
        const o = t.slice(0, n.length), s = a.length === 0 ? [] : t.slice(-a.length), c = t.slice(n.length, a.length === 0 ? 1 / 0 : -a.length);
        return n.every((p, b) => f(p, o[b], O)) && a.every((p, b) => f(p, s[b], O)) && (r.length === 0 || f(r[0], c, O));
      }
      return e.length === t.length && e.every((o, s) => f(o, t[s], O));
    }
    return Reflect.ownKeys(e).every((n) => {
      const a = e[n];
      return (n in t || _(r = a) && r[d]().matcherType === "optional") && f(a, t[n], O);
      var r;
    });
  }
  return Object.is(t, e);
}, v = (e) => {
  var t, O, n;
  return J(e) ? _(e) ? (t = (O = (n = e[d]()).getSelectionKeys) == null ? void 0 : O.call(n)) != null ? t : [] : Array.isArray(e) ? k(e, v) : k(Object.values(e), v) : [];
}, k = (e, t) => e.reduce((O, n) => O.concat(t(n)), []);
function h(e) {
  return Object.assign(e, { optional: () => At(e), and: (t) => $(e, t), or: (t) => Bt(e, t), select: (t) => t === void 0 ? pe(e) : pe(t, e) });
}
function At(e) {
  return h({ [d]: () => ({ match: (t) => {
    let O = {};
    const n = (a, r) => {
      O[a] = r;
    };
    return t === void 0 ? (v(e).forEach((a) => n(a, void 0)), { matched: !0, selections: O }) : { matched: f(e, t, n), selections: O };
  }, getSelectionKeys: () => v(e), matcherType: "optional" }) });
}
function $(...e) {
  return h({ [d]: () => ({ match: (t) => {
    let O = {};
    const n = (a, r) => {
      O[a] = r;
    };
    return { matched: e.every((a) => f(a, t, n)), selections: O };
  }, getSelectionKeys: () => k(e, v), matcherType: "and" }) });
}
function Bt(...e) {
  return h({ [d]: () => ({ match: (t) => {
    let O = {};
    const n = (a, r) => {
      O[a] = r;
    };
    return k(e, v).forEach((a) => n(a, void 0)), { matched: e.some((a) => f(a, t, n)), selections: O };
  }, getSelectionKeys: () => k(e, v), matcherType: "or" }) });
}
function i(e) {
  return { [d]: () => ({ match: (t) => ({ matched: !!e(t) }) }) };
}
function pe(...e) {
  const t = typeof e[0] == "string" ? e[0] : void 0, O = e.length === 2 ? e[1] : typeof e[0] == "string" ? void 0 : e[0];
  return h({ [d]: () => ({ match: (n) => {
    let a = { [t ?? X]: n };
    return { matched: O === void 0 || f(O, n, (r, o) => {
      a[r] = o;
    }), selections: a };
  }, getSelectionKeys: () => [t ?? X].concat(O === void 0 ? [] : v(O)) }) });
}
function ke(e) {
  return !0;
}
function u(e) {
  return typeof e == "number";
}
function S(e) {
  return typeof e == "string";
}
function q(e) {
  return typeof e == "bigint";
}
h(i(ke));
h(i(ke));
const m = (e) => Object.assign(h(e), { startsWith: (t) => {
  return m($(e, (O = t, i((n) => S(n) && n.startsWith(O)))));
  var O;
}, endsWith: (t) => {
  return m($(e, (O = t, i((n) => S(n) && n.endsWith(O)))));
  var O;
}, minLength: (t) => m($(e, ((O) => i((n) => S(n) && n.length >= O))(t))), length: (t) => m($(e, ((O) => i((n) => S(n) && n.length === O))(t))), maxLength: (t) => m($(e, ((O) => i((n) => S(n) && n.length <= O))(t))), includes: (t) => {
  return m($(e, (O = t, i((n) => S(n) && n.includes(O)))));
  var O;
}, regex: (t) => {
  return m($(e, (O = t, i((n) => S(n) && !!n.match(O)))));
  var O;
} });
m(i(S));
const w = (e) => Object.assign(h(e), { between: (t, O) => w($(e, ((n, a) => i((r) => u(r) && n <= r && a >= r))(t, O))), lt: (t) => w($(e, ((O) => i((n) => u(n) && n < O))(t))), gt: (t) => w($(e, ((O) => i((n) => u(n) && n > O))(t))), lte: (t) => w($(e, ((O) => i((n) => u(n) && n <= O))(t))), gte: (t) => w($(e, ((O) => i((n) => u(n) && n >= O))(t))), int: () => w($(e, i((t) => u(t) && Number.isInteger(t)))), finite: () => w($(e, i((t) => u(t) && Number.isFinite(t)))), positive: () => w($(e, i((t) => u(t) && t > 0))), negative: () => w($(e, i((t) => u(t) && t < 0))) });
w(i(u));
const g = (e) => Object.assign(h(e), { between: (t, O) => g($(e, ((n, a) => i((r) => q(r) && n <= r && a >= r))(t, O))), lt: (t) => g($(e, ((O) => i((n) => q(n) && n < O))(t))), gt: (t) => g($(e, ((O) => i((n) => q(n) && n > O))(t))), lte: (t) => g($(e, ((O) => i((n) => q(n) && n <= O))(t))), gte: (t) => g($(e, ((O) => i((n) => q(n) && n >= O))(t))), positive: () => g($(e, i((t) => q(t) && t > 0))), negative: () => g($(e, i((t) => q(t) && t < 0))) });
g(i(q));
h(i(function(e) {
  return typeof e == "boolean";
}));
h(i(function(e) {
  return typeof e == "symbol";
}));
h(i(function(e) {
  return e == null;
}));
h(i(function(e) {
  return e != null;
}));
class Et extends Error {
  constructor(t) {
    let O;
    try {
      O = JSON.stringify(t);
    } catch {
      O = t;
    }
    super(`Pattern matching error: no pattern matches value ${O}`), this.input = void 0, this.input = t;
  }
}
const H = { matched: !1, value: void 0 };
function Ae(e) {
  return new C(e, H);
}
class C {
  constructor(t, O) {
    this.input = void 0, this.state = void 0, this.input = t, this.state = O;
  }
  with(...t) {
    if (this.state.matched) return this;
    const O = t[t.length - 1], n = [t[0]];
    let a;
    t.length === 3 && typeof t[1] == "function" ? a = t[1] : t.length > 2 && n.push(...t.slice(1, t.length - 1));
    let r = !1, o = {};
    const s = (p, b) => {
      r = !0, o[p] = b;
    }, c = !n.some((p) => f(p, this.input, s)) || a && !a(this.input) ? H : { matched: !0, value: O(r ? X in o ? o[X] : o : this.input, this.input) };
    return new C(this.input, c);
  }
  when(t, O) {
    if (this.state.matched) return this;
    const n = !!t(this.input);
    return new C(this.input, n ? { matched: !0, value: O(this.input, this.input) } : H);
  }
  otherwise(t) {
    return this.state.matched ? this.state.value : t(this.input);
  }
  exhaustive(t = Yt) {
    return this.state.matched ? this.state.value : t(this.input);
  }
  run() {
    return this.exhaustive();
  }
  returnType() {
    return this;
  }
  narrow() {
    return this;
  }
}
function Yt(e) {
  throw new Et(e);
}
const _t = /* @__PURE__ */ new Set([
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
]), Be = 40, j = 41, Ee = 91, N = 93, Ye = 123, R = 125, Ut = 44, Xt = 58, Ct = 35, jt = 64, W = 47, Nt = 62, Rt = 45, ce = 34, $e = 39, Zt = 92, It = 10, be = 42, he = 96, _e = /* @__PURE__ */ new Set([Xt, Ct, jt, W]), Mt = new T((e) => {
  for (let t = 0, O = 0; ; O++) {
    if (e.next < 0) {
      O && e.acceptToken(oe);
      break;
    }
    if (e.next === Rt)
      t++;
    else if (e.next === Nt && t >= 2) {
      O > 3 && e.acceptToken(oe, -2);
      break;
    } else
      t = 0;
    e.advance();
  }
});
function Ue(e) {
  let t = !1, O = null, n = !1;
  return () => t ? n ? (n = !1, !0) : e.next === Zt ? (n = !0, !0) : ((O === "double" && e.next === ce || O === "single" && e.next === $e || O === "template" && e.next === he) && (t = !1, O = null), !0) : e.next === ce ? (t = !0, O = "double", !0) : e.next === $e ? (t = !0, O = "single", !0) : e.next === he ? (t = !0, O = "template", !0) : !1;
}
function Xe(e) {
  let t = !1, O = !1;
  return () => t ? (e.next === It && (t = !1), !0) : O ? (e.next === be && e.peek(1) === W && (O = !1), !0) : e.next === W && e.peek(1) === W ? (t = !0, !0) : e.next === W && e.peek(1) === be ? (O = !0, !0) : !1;
}
function Kt(e) {
  let t = "";
  for (let O = 0; O < 3; O++)
    t += String.fromCharCode(e.peek(O));
  return t === " as";
}
function Ce(e = !1) {
  return (t) => {
    if (_e.has(t.next))
      return;
    const O = Xe(t), n = Ue(t), a = [], r = (o) => {
      const s = a.lastIndexOf(o);
      if (s !== -1)
        for (; a.length > s; )
          a.pop();
    };
    for (let o = 0; ; o++) {
      if (t.next < 0) {
        o > 0 && t.acceptToken(e ? G : D);
        break;
      }
      if (O() || n()) {
        t.advance();
        continue;
      }
      if (a.length === 0 && (t.next === R || t.next === j || t.next === N || e && Kt(t))) {
        t.acceptToken(e ? G : D);
        break;
      }
      Ae(t.next).with(Be, () => a.push("(")).with(j, () => r("(")).with(Ee, () => a.push("[")).with(N, () => r("[")).with(Ye, () => a.push("{")).with(R, () => r("{")).otherwise(() => {
      }), t.advance();
    }
  };
}
const Dt = new T(Ce()), Gt = new T(Ce(!0)), Ft = new T((e) => {
  if (_e.has(e.peek(0)))
    return;
  const t = Xe(e), O = Ue(e), n = [], a = (r) => {
    const o = n.lastIndexOf(r);
    if (o !== -1)
      for (; n.length > o; )
        n.pop();
  };
  for (let r = 0; ; r++) {
    if (e.next < 0) {
      r > 0 && e.acceptToken(Y);
      break;
    }
    if (t() || O()) {
      e.advance();
      continue;
    }
    if (n.length === 0 && (e.next === R || e.next === j || e.next === N || e.next === Ut)) {
      e.acceptToken(Y);
      break;
    }
    switch (e.next) {
      case Be:
        n.push("(");
        break;
      case j:
        a("(");
        break;
      case Ee:
        n.push("[");
        break;
      case N:
        a("[");
        break;
      case Ye:
        n.push("{");
        break;
      case R:
        a("{");
        break;
    }
    if (r !== 0 && n.length === 0 && _t.has(e.next)) {
      e.acceptToken(Y);
      break;
    }
    e.advance();
  }
}), Jt = Ke({
  "Text RawText": l.content,
  "StartTag StartCloseTag SelfClosingEndTag EndTag": l.angleBracket,
  TagName: l.tagName,
  "MismatchedCloseTag/TagName": [l.tagName, l.invalid],
  AttributeName: l.attributeName,
  UnquotedAttributeValue: l.attributeValue,
  "AttributeValue AttributeValueContent": l.attributeValue,
  Is: l.definitionOperator,
  "EntityReference CharacterReference": l.character,
  Comment: l.blockComment,
  ProcessingInst: l.processingInstruction,
  DoctypeDecl: l.documentMeta,
  "{ }": l.bracket,
  "[ ]": l.squareBracket,
  "( )": l.paren,
  "| , :": l.punctuation,
  "...": l.derefOperator,
  ComponentName: l.className,
  SvelteElementNamespace: l.namespace,
  SvelteElementType: l.tagName,
  StyleAttributeName: l.propertyName,
  BlockType: l.controlKeyword,
  BlockPrefix: l.typeOperator,
  "UnknownBlock/BlockType": l.invalid,
  UnknownBlockContent: l.invalid,
  "if then catch": l.controlKeyword,
  as: l.definitionOperator,
  Variable: l.variableName,
  SnippetIdentifier: l.function(l.variableName),
  Modifier: l.modifier,
  DirectlyInterpolatedAttributeValue: l.variableName,
  "DirectiveOn/DirectiveName": l.controlKeyword,
  "DirectiveOn/DirectiveTarget": l.typeName,
  "DirectiveUse/DirectiveName": l.controlKeyword,
  "DirectiveUse/DirectiveTarget": l.function(l.variableName),
  "DirectiveBind/DirectiveName": l.controlKeyword,
  "DirectiveBind/DirectiveTarget": l.variableName,
  "DirectiveLet/DirectiveName": l.definitionKeyword,
  "DirectiveLet/DirectiveTarget": l.definition(l.variableName),
  "DirectiveTransition/DirectiveName": l.operatorKeyword,
  "DirectiveTransition/DirectiveTarget": l.function(l.variableName),
  "DirectiveIn/DirectiveName": l.operatorKeyword,
  "DirectiveIn/DirectiveTarget": l.function(l.variableName),
  "DirectiveOut/DirectiveName": l.operatorKeyword,
  "DirectiveOut/DirectiveTarget": l.function(l.variableName),
  "DirectiveAnimate/DirectiveName": l.operatorKeyword,
  "DirectiveAnimate/DirectiveTarget": l.function(l.variableName),
  "DirectiveClass/DirectiveName": l.attributeName,
  "DirectiveClass/DirectiveTarget": l.variableName,
  "DirectiveStyle/DirectiveName": l.attributeName,
  "DirectiveStyle/DirectiveTarget": l.propertyName
}), Ht = { __proto__: null, "#": 43, ":": 53, "/": 61, "@": 111 }, Lt = { __proto__: null, if: 46, else: 54, each: 66, await: 84, then: 92, catch: 96, key: 104, html: 112, debug: 116, const: 120, snippet: 126, render: 134, attach: 232 }, zt = { __proto__: null, if: 56, as: 68, then: 86, catch: 88 }, eO = { __proto__: null, on: 333, bind: 337, let: 339, class: 341, style: 343, use: 345, transition: 347, in: 349, out: 351, animate: 353 }, tO = { __proto__: null, svelte: 259 }, OO = Me.deserialize({
  version: 14,
  states: "!.YQQO&rOOO!UO&rO'#CmO#VO&rO'#C{O$WO&rO'#DUO%XO&rO'#D`O&YO&rO'#DkO'ZO,vO'#DrO'iO,UO'#DzO'qO,UO'#ExO'yO,UO'#E{O(RO,UO'#FOO(aO,UO'#FUO(iOXO'#DyO(tOYO'#DyO)PO[O'#DyO*`O&rO'#DyOOOW'#Dy'#DyO*gO,fO'#FWO(RO,UO'#FYO(RO,UO'#FZOOOW'#Fs'#FsOOOW'#F]'#F]QQO&rOOOOOW'#F_'#F_O!UO&rO,59XOOOW,59X,59XO+QO,vO'#DrO#VO&rO,59gOOOW,59g,59gO+XO,vO'#DrOOOW'#F`'#F`O$WO&rO,59pOOOW,59p,59pO+qO,vO'#DrOOOW'#Fa'#FaO%XO&rO,59zOOOW,59z,59zO+xO,vO'#DrO&YO&rO,5:VOOOW,5:V,5:VO,ZO,vO'#DrO,lO,UO,5:^O,qO7[O,5:_O,vO7[O,59YO-XO7[O,5:OOOO%x'#F^'#F^O-gO,UO,5:fO-oO7[O,5:fO-wO,UO,5;dO.PO7[O,5;dO.XO,UO,5;gO.aO7[O,5;gO(RO,UO,5;jO.iO7[O'#FQOOOO'#GY'#GYO.nO7[O,5;jO.yO,UO,5;pO/RO7[O,5;pOOOX'#Fh'#FhO/^OXO'#EvO/iOXO,5:eOOOY'#Fi'#FiO/qOYO'#EyO/|OYO,5:eOOO['#Fj'#FjO0UO[O'#E|O0aO[O,5:eO0iO&rO,5:eO(RO,UO'#FTOOOW,5:e,5:eOOO`'#Fl'#FlO0pO,fO,5;rOOOW,5;r,5;rO(RO,UO,5;tO0xO7[O,5;tO(RO,UO,5;uO1QO7[O,5;uOOOW-E9Z-E9ZOOOW-E9]-E9]OOOW1G.s1G.sO1YO7[O,59aO1_O7[O,59eOOOW1G/R1G/RO1dO7[O,59oOOOW-E9^-E9^OOOW1G/[1G/[O1iO7[O,59uO1qO7[O,59yOOOW-E9_-E9_OOOW1G/f1G/fO1vO7[O,59}OOOW1G/q1G/qO1{O7[O,5:ZOOOW1G/x1G/xO2QOMhO1G/yO'lO,UO1G.tO'lO,UO1G/SO'lO,UO1G/]O'lO,UO1G/gO'lO,UO1G/rO2]OpO1G/jO'lO,UO1G/mO2bOpO1G/oO2gOpO1G/vOOO%x-E9[-E9[O2lO7[O1G0QO2tO!LQO'#FdO2lO7[O1G0QOOOX1G0Q1G0QO3rO7[O1G1OO3rO7[O1G1OOOOY1G1O1G1OO3zO7[O1G1RO4SO!LQO1G1RO3zO7[O1G1ROOO[1G1R1G1RO4ZO7[O1G1UO4fO$ISO,5;lO4kO!LQO1G1UO4ZO7[O1G1UOOOW1G1U1G1UOOOW1G1[1G1[O4uO7[O1G1[O5QO!LQO1G1[O4uO7[O1G1[OOOX-E9f-E9fO5[O,UO'#EwOOOW1G0P1G0POOOY-E9g-E9gO5dO,UO'#EzOOO[-E9h-E9hO5lO,UO'#E}O(RO,UO,5;oO5tO7[O,5;oOOO`-E9j-E9jOOOW1G1^1G1^O5|O7[O1G1`O5|O7[O1G1`OOOW1G1`1G1`O6UO7[O1G1aO6UO7[O1G1aOOOW1G1a1G1aP*oO,vO'#DrO6^O,UO1G.{O6fO,UO1G/PO6kO,UO1G/ZP+`O,vO'#DrO6pO,UO1G/aO6xO,UO1G/cO7QO,UO1G/eO7VO,UO1G/iO7[O,UO1G/uO7aOMhO7+%eOOOW7+%e7+%eO7lO,UO7+%eO7qO,vO7+$`O7yO-hO7+$nO8RO.zO7+$wO8ZO,vO7+%RO8cO(CWO7+%^O8kO,UO7+%UO8pO07`O7+%XO8xO,UO7+%ZO8}O,UO7+%bO9SO7[O7+%lOOOX7+%l7+%lO9[O(CWO'#D|OOOO'#ES'#ESO9mO7[O'#EROOOO'#EW'#EWO9rO7[O'#EVOOOO'#EY'#EYO9wO7[O'#EXOOOO'#E['#E[O9|O7[O'#EZOOOO'#E^'#E^O:RO7[O'#E]OOOO'#E`'#E`O:WO7[O'#E_OOOO'#Eb'#EbO:]O7[O'#EaOOOO'#Ed'#EdO:bO7[O'#EcOOOO'#Ef'#EfO:gO7[O'#EeOOOO'#Eh'#EhO:lO7[O'#EgO:qO7[O'#EQO;SO7[O'#EpO;bO7[O'#ErOOOO'#Fv'#FvOOOO,5<O,5<OOOOO'#Fw'#FwOOOO-E9b-E9bO;sO7[O7+&jOOOY7+&j7+&jO;{O!LQO7+&mO<SO7[O7+&mOOO[7+&m7+&mO<[O!LQO7+&pO<fO7[O7+&pOOOW7+&p7+&pOOOW7+&v7+&vOOOO1G1W1G1WOOOO,5<V,5<VOOOO-E9i-E9iO<qO!LQO7+&vO<{O7[O7+&vO=WO,UO,5;cO=`O7[O,5;cO=hO,UO,5;fO=pO7[O,5;fO=xO,UO,5;iO>QO7[O,5;iO>YO7[O1G1ZO>YO7[O1G1ZOOOW1G1Z1G1ZO>bO7[O7+&zOOOW7+&z7+&zO>jO7[O7+&{OOOW7+&{7+&{O>rO(CWO7+$gOOOW7+$g7+$gOOOW7+$k7+$kOOOW7+$u7+$uO>zO07`O7+${OOOW7+${7+${O?SO07`O7+$}OOOW7+$}7+$}OOOW7+%P7+%POOOW7+%T7+%TOOOW7+%a7+%aOOOW<<IP<<IPO?[O,UO<<IPO?aO,UO<<GzO'lO,UO<<HYO?fO,UO<<HcO?nO,UO<<HmOOOO'#Dn'#DnO?sO,UO<<HxOOOW<<Hp<<HpO?xO,UO<<HsOOOW<<Hu<<HuOOOW<<H|<<H|OOOX<<IW<<IWO@TO(CWO,5:hOOOO'#D}'#D}OOOO,5:h,5:hO@cO,UO,5:hO@kOpO,5:jO@pO7[O,5;_O@uO?MpO,5:mO@zO?MpO,5:qOAPO?MpO,5:sOAUO?MpO,5:uOAZO?MpO,5:wOA`O?MpO,5:yOAeO?MpO,5:{OAjO?MpO,5:}OAoO?MpO,5;POAtO?MpO,5;RPAyO7[O,5:lOBXO!0LbO'#FeOB^O7[O,5:lOBoO#@ItO,5:lOCQO,UO,5;[OCYO#@ItO,5;[PCkO7[O,5;^OCyO7[O,5;^OD[O#@ItO,5;^OOOY<<JU<<JUOOO[<<JX<<JXODmO!LQO<<JXOOOW<<J[<<J[OOOW<<Jb<<JbODtO!LQO<<J[P2tO!LQO'#F^OEOO!LQO<<JbOEYO7[O1G0}OEYO7[O1G0}OOOW1G0}1G0}OEbO7[O1G1QOEbO7[O1G1QOOOW1G1Q1G1QOEjO7[O1G1TOEjO7[O1G1TOOOW1G1T1G1TOErO7[O7+&uOOOW7+&u7+&uOOOW<<Jf<<JfOOOW<<Jg<<JgO'lO,UO<<HROEzO,UO<<HgOFSO,UO<<HiOOOWAN>kAN>kOOOWAN=fAN=fOF[O(CWOAN=tOFdO(CWOAN=}OOOWAN=}AN=}OOOWAN>XAN>XOFoO07`OAN>dOFzO,UOAN>_OGVO07`O'#FbOG_O,UOAN>_OOOWAN>_AN>_OGgO(CWO1G0SOOOO1G0S1G0SOGuO,UO1G0SOG}OpO1G0UOGuO,UO1G0SOHSO,UO1G0UO'lO,UO1G0yOOOO1G0X1G0XOOOO1G0]1G0]OOOO1G0_1G0_OOOO1G0a1G0aOOOO1G0c1G0cOOOO1G0e1G0eOOOO1G0g1G0gOOOO1G0i1G0iOOOO1G0k1G0kOOOO1G0m1G0mOHXO#@ItO1G0WOOOO,5<P,5<PPHjO7[O1G0WOOOO-E9c-E9cOHXO#@ItO1G0WOHxOpO'#DrOOOO'#El'#ElOI`O&2DjO'#ElOIxO+D:UO'#ElOOOO1G0W1G0WOJPO#@ItO1G0vOJPO#@ItO1G0vOOOO1G0v1G0vOJbO#@ItO1G0xPJsO7[O1G0xOJbO#@ItO1G0xOOOO1G0x1G0xOOO[AN?sAN?sOOOWAN?vAN?vOOOWAN?|AN?|OKRO7[O7+&iOOOW7+&i7+&iOKZO7[O7+&lOOOW7+&l7+&lOKcO7[O7+&oOOOW7+&o7+&oOOOW<<Ja<<JaOKkO,vOAN=mOKsO,UOAN>ROOOWAN>RAN>ROK{O,UOAN>TOOOWAN>TAN>TO'lO,UOG23`O'lO,UOG23iOLTO07`OG24OOL`O07`O'#FcOLnO07`OG24OOLvO,UOG24OOMOO,UOG23yOOOWG23yG23yOMWO07`O,5;|OOOO,5;|,5;|OOOO-E9`-E9`OOOO7+%n7+%nOM`O,UO7+%nOMhO,UO7+%pOOOO7+%p7+%pOMmO,vO7+&eOMuO#@ItO7+%rOOOO7+%r7+%rPMuO#@ItO7+%rOOOO'#GV'#GVOOOO'#Ff'#FfONWO&2DjO'#EmOOOO,5;W,5;WON_O,UO,5;WOOOO'#Fg'#FgONdO+D:UO'#EnONkO,UO,5;WONpO#@ItO7+&bOOOO7+&b7+&bO! RO#@ItO7+&dOOOO7+&d7+&dP! RO#@ItO7+&dOOOW<<JT<<JTOOOW<<JW<<JWOOOW<<JZ<<JZO! dO,UOG23XOOOWG23mG23mOOOWG23oG23oO! iO.zOLD(zO! qO.zOLD)TO! yO07`OLD)jO!!RO,UOLD)jO!!ZO07`O,5;}O!!iO07`O,5;}OOOO-E9a-E9aO!!RO,UOLD)jOOOWLD)jLD)jOOOWLD)eLD)eOOOO1G1h1G1hOOOO<<IY<<IYOOOO<<I[<<I[O!!tO,UO<<JPOOOO<<I^<<I^P!!yO#@ItO<<I^OOOO-E9d-E9dOOOO1G0r1G0rOOOO-E9e-E9eOOOO<<I|<<I|OOOO<<JO<<JOP!#[O#@ItO<<JOOOOWLD(sLD(sO!#mO,UO!$'LfO!#xO,UO!$'LoO!#}O,UO!$'MUO!#}O,UO!$'MUOOOW!$'MU!$'MUO!$VO07`O1G1iOOOOAN?kAN?kPOOOAN>xAN>xPOOOAN?jAN?jO!$bO,UO!)9BQOOOW!)9BQ!)9BQO!$mO,UO!)9BQOOOW!)9BZ!)9BZO!$uO,UO!)9BpOOOW!)9Bp!)9BpOOOW!.K7l!.K7lO!$}OpO!.K7lO!%SO07`O!.K7lOOOW!.K8[!.K8[O!%bO,UO!4/-WOOOW!4/-W!4/-WO!%gOpO!4/-WO!%lO,UO!4/-WO!%tO,UO!9A!rO!%|O,UO!9A!rO!&RO,UO!9A!rOOOW!9A!r!9A!rO!&^O,UO!?$F^OOOW!?$F^!?$F^O!&^O,UO!?$F^O!&fOpO!?$F^OOOW!D6;x!D6;xO!&kO,UO!D6;xO!&sO,UO!D6;xOOOW!IH1d!IH1dO!&xO,UO!IH1dO!'QO,UO# ,'OOOOW# ,'O# ,'OOOOW#&=Jj#&=Jj",
  stateData: "!'g~OSYOTVOUWOVXOWZOYcOZbO[dOcUO!idO!jdO!kdO!ldO#{dO$OeO$}aO~OSYOTVOUWOVXOWZOYcOZbO[dOcjO!idO!jdO!kdO!ldO#{dO$}aO~OSYOTVOUWOVXOWZOYcOZbO[dOcmO!idO!jdO!kdO!ldO#{dO$}aO~OSYOTVOUWOVXOWZOYcOZbO[dOcqO!idO!jdO!kdO!ldO#{dO$}aO~OSYOTVOUWOVXOWZOYcOZbO[dOcuO!idO!jdO!kdO!ldO#{dO$}aO~OSYOTVOUWOVXOWZOYcOZbO[dOcxO!idO!jdO!kdO!ldO#{dO$}aO~O]yOdzOe{O!X|O~O!o!PO$h}O~O!o!RO$h}O~O!o!TO$h}O~O!o!WO#s!WO#u!VO$h}O~O!o!ZO$h}O~O$b![OP#jP$e#jP~O$c!_OQ#mP$e#mP~O$d!bOR#pP$e#pP~OSYOTVOUWOVXOWZOX!fOYcOZbO[dOcUO!idO!jdO!kdO!ldO#{dO$}aO~O$e!gO~P)[O$f!hO%O!jO~O]yOdzOe{Oj!rO!X|O~On!sO~P*oOn!uO~P*oO]yOdzOe{Oj!xO!X|O~On!yO~P+`O]yOdzOe{On!|O!X|O~O]yOdzOe{On#OO!X|O~Oh#PO~Of#QO~Og#ROq#SOz#TO!U#UO!a#VO~O!Y#WO![#XO!^#YO!e#ZO~O!o#]O$h}O~O#i#`O$h}O~O!o#aO$h}O~O#i#cO$h}O~O!o#dO$h}O~O#i#gO$h}O~O$m#iO~O#i#lO#y#mO$h}O~O!o#nO$h}O~O#i#mO#y#mO$h}O~O$b![OP#jX$e#jX~OP#rO$e#sO~O$c!_OQ#mX$e#mX~OQ#uO$e#sO~O$d!bOR#pX$e#pX~OR#wO$e#sO~O$e#sO~P)[O$f!hO%O#{O~O#i$OO$h}O~O#i$RO$h}O~Ok$TO~Og$UO~Oq$VO~O!O$XO!Q$YO~Oz$ZO~O!U$[O~O!a$]O~Oh$_O!h$`O$h}O~O]$fO~O]$hO~O]$iO~O#i$kO$h}O~Oc$lO!w%TO#e%SO$h}O$l$mO$n$oO$o$qO$p$sO$q$uO$r$wO$s$yO$t${O$u$}O$v%PO~O#i%ZO$h}O~O#i%^O$h}O~O#i%^O~P2tO#i%aO#y%bO$h}O~O#v%cO~O#i%aO#y%bO~P2tO#i%bO#y%bO$h}O~O#i%bO#y%bO~P2tO!o%iO$h}O~O!o%kO$h}O~O!o%mO$h}O~O#i%pO$h}O~O#i%rO$h}O~O#i%tO$h}O~Oh%vO$h}O~Oh%wO~Oh%xO~Oh%zO$h}O~Oh%|O$h}O~Oh%}O~Oh&OO~Oh&PO~Oh&QO!h&RO$h}O~Oh&QO~O]&SO$h}O~O^&TO$h}O~O_&UO$h}O~O]&VO$h}O~O$h}O$i&WO~Oh&YO~Ov&ZO$h}O~Oh&[O~Oh&]O~O#i&^O$h}O~Oh&aO!X&dO!s&cO$h}O$i&`O~O$m&eO~O$m&fO~O$m&gO~O$m&hO~O$m&iO~O$m&jO~O$m&kO~O$m&lO~O$m&mO~O$m&nO~O#]&pO#_&rO#i!tX$h!tX#y!tX~O#_&tO$h}O#i#dX#y#dX~O#]&pO#_&wO#i#fX$h#fX#y#fX~O#i&xO$h}O~O#i&yO~P2tO#i&yO$h}O~O#i&{O#y&|O~P2tO#i&{O#y&|O$h}O~O#i&|O#y&|O~P2tO#i&|O#y&|O$h}O~O!o'QO$h}O~O#i'SO$h}O~O!o'TO$h}O~O#i'VO$h}O~O!o'WO$h}O~O#i'YO$h}O~O#i'[O$h}O~O#i']O$h}O~O#i'^O$h}O~Ol'_O$h}O~Ov'`O$h}O~Ov'aO$h}O~Oh'bO~Oh'cO~Oh'fO$h}O~Oh'gO~Os'hO~Oh'lOu'jO$h}O~Oh'nO!s'pO$h}O$i&`O~Oh'nO$h}O~O]'rO~O#h'sO~O!x'tO~O!x'uO~O!x'vO~O!x'wO~O!x'xO~O!x'yO~O!x'zO~O!x'{O~O!x'|O~O!x'}O~O#_(OO#i!ta$h!ta#y!ta~O#^(PO~O#]&pO#_(OO#i!ta$h!ta#y!ta~Oc(TO#c(XO$h}O$w(VO$z(WO~O#_(YO$h}O~Oc(TO#c([O$h}O$w(VO$z(WO~O#_(]O#i#fa$h#fa#y#fa~O#]&pO#_(]O#i#fa$h#fa#y#fa~Oc(TO#c(`O$h}O$w(VO$z(WO~O#i(aO~P2tO#i(bO#y(cO~P2tO#i(cO#y(cO~P2tO#i(eO$h}O~O#i(gO$h}O~O#i(iO$h}O~O#i(jO$h}O~Oh(mO$h}O~Oh(oO$h}O~Or(pO$h}O~O{(qO|(qO$h}O~Ot(uOv(sO$h}O~Oh(wOu'jO$h}O~Ov(yO$h}O~Oh(wOu'jO~Oh({O!s$Qc$h$Qc$i$Qc~Oh({O$h}O~O](}O~Oh)OO~Oc(TO#c)RO$h}O$w(VO$z(WO~O#_)SO#i!ti$h!ti#y!ti~O]yO~Oc(TO!j)TO!k)TO!l)TO$x)UO~O$w)WO~PH}Oc(TO!j)TO!k)TO!l)TO${)YO~O$z)WO~PIgOc(TO#c)^O$h}O$w(VO$z(WO~Oc(TO#c)`O$h}O$w(VO$z(WO~O#_)aO#i#fi$h#fi#y#fi~O#i)bO$h}O~O#i)cO$h}O~O#i)dO$h}O~O])eO$h}O~Oh)fO$h}O~Oh)gO$h}O~Ot)kOv(sO$h}O~Ou'jO$h}Ot$VXv$VX~Ot)kOv(sO~Oh)pO$h}O~Oh)qOu'jO~Ov)rO$h}O~Oh)sO$h}O~Oh)tO~O])uO$h}O~Oc(TO#c)vO$h}O$w(VO$z(WO~O$w#aX~PH}O$w)yO~O$z#bX~PIgO$z)yO~Oc(TO#c){O$h}O$w(VO$z(WO~Oc(TO#c)|O$h}O$w(VO$z(WO~Oh*OO~O_*PO$h}O~O_*QO$h}O~Ot*ROv(sO~Oh*TO$h}O~Ou'jO$h}Ot$Vav$Va~Ou'jOt$Vav$Va~Oh*VO~Oc(TO#c*WO$h}O$w(VO$z(WO~Oc(TO#c*XO$h}O$w(VO$z(WO~Oh*ZOu*[O$h}O~Oh*]O~Oh*_O$h}O~Ou'jOt$Viv$Vi~Oh*`Os*aO$h}O~Oh*`O$h}O~Oh*cO$h}O~O]*dO~Oh*eOs*fOv*gO$h}O~Ot*hO~O]*iO~Oh*kO$h}O~Oh*mO$h}O~Ot*nO~Oh*mOs*oO$h}O~Oh*pO$h}O~O]*rO~Oh*sO$h}O~Ot*tO~Oh*vO$h}O~Oh*wO$h}O~O!h$h#y$}#{$O!k!j#e!w!l#i~",
  goto: ";z$}PPPPPPPPPPPPPPPPP%O%`PPPPPP%pPPP%vP%O%|PPPPPP&^%O&dPPP&tP&tP&x%O'OP'`%OPP%OP%OP%O'fP'v'y%OP(P%OPPPPP%O(yP)Z)h)ZP)Z)n){PP)n*Y)n*g)n*t)n+R)n+`)n+m)n+z)n,X)n,fPPP,s-k-nP)ZP)Z)ZPP-q-t-w.X.[._.o.r.uP/VPP/a/gP%OP%O%OP/w/}6z7U7[7j7|8W8r8|9S9Y9`9f9l:OPPPPPP:UPP:l:{PPPPPPPPPPPPP;YPP;bmdOPQRST_fhkosv!emPOPQRST_fhkosv!eXgPQhkQiPR!qhmQOPQRST_fhkosv!eQlQR!tkmROPQRST_fhkosv!eTnRoQpRR!womSOPQRST_fhkosv!eQtSR!{smTOPQRST_fhkosv!eR&X$eQwTR!}vldOPQRST_fhkosv!ep(U&r&t&w(O(S(Y(Z(](_)Q)S)])_)a)w)}X)T(V(W)V)Zm[OPQRST_fhkosv!eg%U#^#e#j#o%[%_%f&z&}'O'PQ&b$lR'o&_g%W#^#e#j#o%[%_%f&z&}'O'Pg$n#^#e#j#o%[%_%f&z&}'O'Pg$p#^#e#j#o%[%_%f&z&}'O'Pg$r#^#e#j#o%[%_%f&z&}'O'Pg$t#^#e#j#o%[%_%f&z&}'O'Pg$v#^#e#j#o%[%_%f&z&}'O'Pg$x#^#e#j#o%[%_%f&z&}'O'Pg$z#^#e#j#o%[%_%f&z&}'O'Pg$|#^#e#j#o%[%_%f&z&}'O'Pg%O#^#e#j#o%[%_%f&z&}'O'Pg%Q#^#e#j#o%[%_%f&z&}'O'PQ(X&rQ([&tQ(`&wS)R(O(SS)^(Y(ZS)`(](_S)v)Q)SQ){)]S)|)_)aQ*W)wR*X)}R)X(VR)[(WR!^[R#s!^m]OPQRST_fhkosv!eR!a]R#s!am^OPQRST_fhkosv!eR!d^R#s!dm_OPQRST_fhkosv!ea!WYbc!U!f!k!m#xQ!g_R#s!em`OPQRST_fhkosv!eQfOR!ofQ!OVQ!QWQ!SXQ!UYQ!YZQ!kbQ!mc$^#[!O!Q!S!U!Y!k!m#^#e#j#o#x#}$Q$^$a$b$c$d$e$g%[%_%f%h%j%l%o%q%s%u%y%{&s&z&}'O'P'R'U'X'Z'd'e'i'q(S(Z(_(d(f(h(k(l(n(r(x(|)P)Q)])_)h)i)l)o)w)}*S*Y*^*b*j*l*q*u`#^!P!R#]#_#a#b$j%YQ#e!TQ#j!XQ#o!ZQ#x!fQ#}!lQ$Q!nQ$^#QQ$a#RQ$b#SQ$c#TQ$d#UQ$e#VQ$g#XS%[#d#fS%_#h#kS%f#n#pQ%h#rQ%j#uQ%l#wQ%o#yQ%q#|Q%s$PQ%u$TQ%y$XQ%{$YQ&_$lQ&s%SQ&z%]Q&}%`Q'P%gQ'R%iQ'U%kQ'X%mQ'Z%nQ'd&TQ'e&UQ'i&ZQ'm&_Q'q&bQ(S&rQ(Z&tQ(_&wQ(d'QQ(f'TQ(h'WQ(k'_Q(l'`Q(n'aQ(r'hQ(x'jQ(|'oQ)P'sQ)Q(OQ)](YQ)_(]Q)h(pQ)i(qQ)l(sQ)o(uQ)w)SQ)})aQ*S)kQ*Y*PQ*^*RQ*b*[Q*j*gQ*l*hQ*q*nR*u*tQhPQkQT!phkQoRR!voQsSQvTQ!e_V!zsv!eQ'k&ZQ(v'iW(z'k(v)m*UQ)m(sR*U)lQ(t'hQ)j(rT)n(t)jQ#_!PQ#b!RQ#f!TQ$j#][%X#_#b#f$j%Y%]Q%Y#aR%]#dQ&q%RQ&v%TT(R&q&vQ)V(VR)x)VQ)Z(WR)z)ZQ!][R#q!]Q!`]R#t!`Q!c^R#v!cQ#k!XQ#p!ZQ%`#hW%e#k#p%`%gR%g#nQ!iaR#z!iSeOfWgPQhkSnRo]rST_sv!eW%V#^#e%[&z_%d#j#o%_%f&}'O'Pg%R#^#e#j#o%[%_%f&z&}'O'PS)U(V)VT)Y(W)ZQ!XYQ!lbQ!ncQ#h!UQ#y!fQ#|!kQ$P!mR%n#x",
  nodeNames: "⚠ StartCloseTag StartCloseTag StartCloseTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteCloseTag LongExpression AsTerminatedLongExpression ShortExpression Document IfBlock IfBlockOpen { BlockPrefix BlockPrefix BlockType BlockType } ElseBlock BlockPrefix BlockType if IfBlockClose BlockPrefix EachBlock EachBlockOpen BlockType as ( ) , Variable EachBlockClose AwaitBlock AwaitBlockOpen BlockType then catch ThenBlock BlockType CatchBlock BlockType AwaitBlockClose KeyBlock KeyBlockOpen BlockType KeyBlockClose RawHTMLBlock BlockPrefix BlockType DebugBlock BlockType ConstBlock BlockType SnippetBlock SnippetBlockOpen BlockType SnippetIdentifier SnippetBlockClose RenderBlock BlockType Interpolation UnknownBlock UnknownBlockContent Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName DirectlyInterpolatedAttribute DirectlyInterpolatedAttributeValue SpreadInterpolatedAttribute ... Directive DirectiveOn DirectiveName AttributeName DirectiveTarget DirectiveBind DirectiveName DirectiveLet DirectiveName DirectiveClass DirectiveName DirectiveStyle DirectiveName DirectiveUse DirectiveName DirectiveTransition DirectiveName DirectiveIn DirectiveName DirectiveOut DirectiveName DirectiveAnimate DirectiveName | Modifier Is AttributeValue AttributeValueContent AttributeValueContent UnquotedAttributeValue StyleAttribute StyleAttributeName Attribute Attachment BlockType EndTag ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag ComponentName SvelteElementName SvelteElementNamespace SvelteElementType CloseTag SelfClosingTag SelfClosingEndTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",
  maxTerm: 184,
  context: Tt,
  nodeProps: [
    ["closedBy", -10, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, "EndTag", 4, "EndTag SelfClosingEndTag", 18, "IfBlockClose", 19, "}", 32, "EachBlockClose", 35, ")", 41, "AwaitBlockClose", 49, "AwaitBlockOpen", 51, "KeyBlockClose", 62, "SnippetBlockClose", -4, 76, 120, 123, 126, "CloseTag"],
    ["group", -15, 12, 54, 57, 59, 66, 68, 69, 72, 73, 74, 75, 134, 135, 136, 137, "Entity", -5, 17, 31, 40, 50, 61, "Block Entity", -5, 18, 32, 41, 51, 62, "BlockOpen", -3, 25, 45, 47, "BlockInline", -5, 29, 39, 49, 53, 65, "BlockClose", 71, "Entity TextContent", -3, 118, 121, 124, "TextContent Entity"],
    ["openedBy", 24, "{", 29, "IfBlockOpen", 36, "(", 39, "EachBlockOpen", 53, "KeyBlockOpen", 65, "SnippetBlockOpen", 117, "StartTag StartCloseTag StartSelfClosingTag", -4, 119, 122, 125, 131, "OpenTag", 133, "StartTag"]
  ],
  propSources: [Jt],
  skippedNodes: [0],
  repeatNodeCount: 16,
  tokenData: "%Eq$IRR!dOX%aXY/TYZ/TZ[%a[]1{]^/T^p%apq/Tqr2yrsETstFRtuHluv2yvw!)Owx#+fxy#,dyz#.}z|2y|}#1h}!O#4R!O!P#JV!P!Q$#n!Q![2y![!]$&g!]!^2y!^!_$(a!_!`$5X!`!a$6X!a!b2y!b!cFR!c!}$7X!}#R2y#R#S$Nb#S#T%2y#T#o%4y#o#p%>]#p#q%>p#q#r%@h#r#s2y#s$f%a$f$g2y$g%WHl%W%o$Nb%o%pHl%p&a$Nb&a&bHl&b1p$Nb1p4UHl4U4d$Nb4d4eHl4e$IS$Nb$IS$I`Hl$I`$Ib$Nb$Ib$KhHl$Kh%#t$Nb%#t&/xHl&/x&Et$Nb&Et&FVHl&FV;'S$Nb;'S;:j%By;:j;=`%CP<%l?&rHl?&r?Ah$Nb?Ah?BY%CV?BY?Mn$Nb?MnO%CV$3P%ng!iP#c7[$xMh${!LQ!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V7e'`g!iP#c7[!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'VX)OZ!iP!hWOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(wW)vS!hWO#q)q#r;'S)q;'S;=`*S<%lO)qW*VP;=`<%l)qP*_U!iPOv*Yw!^*Y!_#o*Y#p;'S*Y;'S;=`*q<%lO*YP*tP;=`<%l*YX*zP;=`<%l(w7d+Uc#c7[!hWOX*}XZ)qZ[*}[^)q^p*}pq)qqr*}rs)qsw*}wx)qx!^*}!^!a)q!a#S*}#S#T)q#T#q*}#q#r,a#r;'S*};'S;=`-[<%lO*}7[,fY#c7[OX,aZ[,a^p,aqr,asw,ax!^,a!a#S,a#T;'S,a;'S;=`-U<%lO,a7[-XP;=`<%l,a7d-_P;=`<%l*}7]-id!iP#c7[OX-bXZ*YZ[-b[^*Y^p-bpq*Yqr-brs*Ysv-bvw,awx*Yx!^-b!_!a*Y!a#S-b#S#T*Y#T#o-b#o#p,a#p;'S-b;'S;=`.w<%lO-b7].zP;=`<%l-b7e/QP;=`<%l'V$7o/bb!iP$xMh${!LQ!hW$h<SOX(wXY0jYZ0jZ](w]^0j^p(wpq0jqv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w<T0sb!iP!hW$h<SOX(wXY0jYZ0jZ](w]^0j^p(wpq0jqv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w#Js2WZ!iP$xMh${!LQ!hWOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$DR3^p!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VHg5qp!x&j#^,U!iP#c7[!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VHf8Sm!x&j#^,U#c7[!hW!w`OX*}XZ)qZ[*}[^)q^p*}pq)qqr7urs)qsw7uwx)qx!P7u!P!Q*}!Q![7u![!]*}!]!^7u!^!a)q!a#S7u#S#T9}#T#o7u#o#q*}#q#r<v#r#s7u#s$f*}$f;'S7u;'S;=`>m<%l?Ah7u?Ah?BY*}?BY?Mn7u?MnO*}2Y:Yf!x&j#^,U!hW!w`Oq)qqr9}rs)qsw9}wx)qx!P9}!P!Q)q!Q![9}![!])q!]!^9}!^!a)q!a#o9}#o#q)q#q#r;n#r#s9}#s$f)q$f;'S9};'S;=`<p<%l?Ah9}?Ah?BY)q?BY?Mn9}?MnO)q2Q;wZ!x&j#^,U!w`qr;nsw;nx!P;n!Q![;n!]!^;n!a#o;n#q#s;n$f;'S;n;'S;=`<j<%l?Ah;n?BY?Mn;n2Q<mP;=`<%l;n2Y<sP;=`<%l9}H^=Rf!x&j#^,U#c7[!w`OX,aZ[,a^p,aqr<vsw<vx!P<v!P!Q,a!Q![<v![!],a!]!^<v!a#S<v#S#T;n#T#o<v#o#q,a#q#s<v#s$f,a$f;'S<v;'S;=`>g<%l?Ah<v?Ah?BY,a?BY?Mn<v?MnO,aH^>jP;=`<%l<vHf>pP;=`<%l7u2Z?Qi!x&j#^,U!iP!hW!w`Oq(wqr>srs(wsv>svw9}wx(wx!P>s!P!Q(w!Q![>s![!](w!]!^>s!^!_)q!_!a(w!a#o>s#o#p)q#p#q(w#q#r@o#r#s>s#s$f(w$f;'S>s;'S;=`Bf<%l?Ah>s?Ah?BY(w?BY?Mn>s?MnO(w2R@zf!x&j#^,U!iP!w`Oq*Yqr@ors*Ysv@ovw;nwx*Yx!P@o!P!Q*Y!Q![@o![!]*Y!]!^@o!_!a*Y!a#o@o#p#q*Y#q#s@o#s$f*Y$f;'S@o;'S;=`B`<%l?Ah@o?Ah?BY*Y?BY?Mn@o?MnO*Y2RBcP;=`<%l@o2ZBiP;=`<%l>sH_Byn!x&j#^,U!iP#c7[!w`OX-bXZ*YZ[-b[^*Y^p-bpq*YqrBlrs*YsvBlvw<vwx*Yx!PBl!P!Q-b!Q![Bl![!]-b!]!^Bl!_!a*Y!a#SBl#S#T@o#T#oBl#o#p,a#p#q-b#q#sBl#s$f-b$f;'SBl;'S;=`Dw<%l?AhBl?Ah?BY-b?BY?MnBl?MnO-bH_DzP;=`<%lBlHgEQP;=`<%l5b$3RE`Z$w!5v!iP${!LQ!hWOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$EgFhpd!d!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$H_IVwfS!x&j#^,U!iP#c7[v#t$xMh${!LQ$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx!O5b!O!PNp!P!Q'V!Q![Kp![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}Kp!}#R5b#R#SKp#S#T>s#T#oKp#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g;'SKp;'S;=`!&[<%l?AhKp?Ah?BY!&b?BY?MnKp?MnO!&bLsLVwfS!x&j#^,U!iP#c7[v#t$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx!O5b!O!PNp!P!Q'V!Q![Kp![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}Kp!}#R5b#R#SKp#S#T>s#T#oKp#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g;'SKp;'S;=`!&[<%l?AhKp?Ah?BY!&b?BY?MnKp?MnO!&bK]! Rw!x&j#^,U!iP#c7[v#t!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuNpuv5bvw7uwx(wx!O5b!O!PNp!P!Q'V!Q![Np![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}Np!}#R5b#R#SNp#S#T>s#T#oNp#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g;'SNp;'S;=`!#l<%l?AhNp?Ah?BY!#r?BY?MnNp?MnO!#rK]!#oP;=`<%lNp:Z!#}q!iP#c7[v#t!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'Vtu!#ruv'Vvw*}wx(wx!O'V!O!P!#r!P!Q'V!Q![!#r![!^'V!^!_)q!_!a(w!a!c'V!c!}!#r!}#R'V#R#S!#r#S#T(w#T#o!#r#o#p*}#p#q'V#q#r-b#r$g'V$g;'S!#r;'S;=`!&U<%lO!#r:Z!&XP;=`<%l!#rLs!&_P;=`<%lKp;q!&qqfS!iP#c7[v#t$i!b!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'Vtu!&buv'Vvw*}wx(wx!O'V!O!P!#r!P!Q'V!Q![!&b![!^'V!^!_)q!_!a(w!a!c'V!c!}!&b!}#R'V#R#S!&b#S#T(w#T#o!&b#o#p*}#p#q'V#q#r-b#r$g'V$g;'S!&b;'S;=`!(x<%lO!&b;q!({P;=`<%l!&b$DR!)_n!x&j#^,U#c7[!hW!w`!l#JkOX!+]XZ!,uZ[!+][^!,u^p!+]pq)qqr!2qrs!,ust!Aktw!2qwx!,ux!P!2q!P!Q!+]!Q![!2q![!]!+]!]!^7u!^!a!,u!a#S!2q#S#T!7W#T#o!2q#o#q!+]#q#r!=i#r#s!2q#s$f!+]$f;'S!2q;'S;=`!Ae<%l?Ah!2q?Ah?BY!+]?BY?Mn!2q?MnO!+]$3P!+de#c7[!hWOX!+]XZ!,uZ[!+][^!,u^p!+]pq)qqr!+]rs!,ust*}tw!+]wx!,ux!]!+]!]!^!.{!^!a!,u!a#S!+]#S#T!,u#T#q!+]#q#r!0a#r;'S!+];'S;=`!2k<%lO!+]#Js!,zZ!hWOp!,upq)qqs!,ust)qt!]!,u!]!^!-m!^#q!,u#q#r!.Q#r;'S!,u;'S;=`!.u<%lO!,u#Js!-tS!hW!j#JkO#q)q#r;'S)q;'S;=`*S<%lO)q#Jk!.TVOp!.Qqs!.Qt!]!.Q!]!^!.j!^;'S!.Q;'S;=`!.o<%lO!.Q#Jk!.oO!j#Jk#Jk!.rP;=`<%l!.Q#Js!.xP;=`<%l!,u$3P!/Uc#c7[!hW!j#JkOX*}XZ)qZ[*}[^)q^p*}pq)qqr*}rs)qsw*}wx)qx!^*}!^!a)q!a#S*}#S#T)q#T#q*}#q#r,a#r;'S*};'S;=`-[<%lO*}$2w!0fb#c7[OX!0aXZ!.QZ[!0a[^!.Q^p!0aqr!0ars!.Qst,atw!0awx!.Qx!]!0a!]!^!1n!^!a!.Q!a#S!0a#S#T!.Q#T;'S!0a;'S;=`!2e<%lO!0a$2w!1uY#c7[!j#JkOX,aZ[,a^p,aqr,asw,ax!^,a!a#S,a#T;'S,a;'S;=`-U<%lO,a$2w!2hP;=`<%l!0a$3P!2nP;=`<%l!+]$DR!3On!x&j#^,U#c7[!hW!w`OX!+]XZ!,uZ[!+][^!,u^p!+]pq)qqr!2qrs!,ust7utw!2qwx!,ux!P!2q!P!Q!+]!Q![!2q![!]!+]!]!^!4|!^!a!,u!a#S!2q#S#T!7W#T#o!2q#o#q!+]#q#r!=i#r#s!2q#s$f!+]$f;'S!2q;'S;=`!Ae<%l?Ah!2q?Ah?BY!+]?BY?Mn!2q?MnO!+]$DR!5]m!x&j#^,U#c7[!hW!j#Jk!w`OX*}XZ)qZ[*}[^)q^p*}pq)qqr7urs)qsw7uwx)qx!P7u!P!Q*}!Q![7u![!]*}!]!^7u!^!a)q!a#S7u#S#T9}#T#o7u#o#q*}#q#r<v#r#s7u#s$f*}$f;'S7u;'S;=`>m<%l?Ah7u?Ah?BY*}?BY?Mn7u?MnO*}$-u!7ch!x&j#^,U!hW!w`Op!,upq)qqr!7Wrs!,ust9}tw!7Wwx!,ux!P!7W!P!Q!,u!Q![!7W![!]!,u!]!^!8}!^!a!,u!a#o!7W#o#q!,u#q#r!:p#r#s!7W#s$f!,u$f;'S!7W;'S;=`!=c<%l?Ah!7W?Ah?BY!,u?BY?Mn!7W?MnO!,u$-u!9[f!x&j#^,U!hW!j#Jk!w`Oq)qqr9}rs)qsw9}wx)qx!P9}!P!Q)q!Q![9}![!])q!]!^9}!^!a)q!a#o9}#o#q)q#q#r;n#r#s9}#s$f)q$f;'S9};'S;=`<p<%l?Ah9}?Ah?BY)q?BY?Mn9}?MnO)q$-m!:yf!x&j#^,U!w`Op!.Qqr!:prs!.Qst;ntw!:pwx!.Qx!P!:p!P!Q!.Q!Q![!:p![!]!.Q!]!^!<_!^!a!.Q!a#o!:p#o#q!.Q#q#s!:p#s$f!.Q$f;'S!:p;'S;=`!=]<%l?Ah!:p?Ah?BY!.Q?BY?Mn!:p?MnO!.Q$-m!<jZ!x&j#^,U!j#Jk!w`qr;nsw;nx!P;n!Q![;n!]!^;n!a#o;n#q#s;n$f;'S;n;'S;=`<j<%l?Ah;n?BY?Mn;n$-m!=`P;=`<%l!:p$-u!=fP;=`<%l!7W$Cy!=tl!x&j#^,U#c7[!w`OX!0aXZ!.QZ[!0a[^!.Q^p!0aqr!=irs!.Qst<vtw!=iwx!.Qx!P!=i!P!Q!0a!Q![!=i![!]!0a!]!^!?l!^!a!.Q!a#S!=i#S#T!:p#T#o!=i#o#q!0a#q#s!=i#s$f!0a$f;'S!=i;'S;=`!A_<%l?Ah!=i?Ah?BY!0a?BY?Mn!=i?MnO!0a$Cy!?yf!x&j#^,U#c7[!j#Jk!w`OX,aZ[,a^p,aqr<vsw<vx!P<v!P!Q,a!Q![<v![!],a!]!^<v!a#S<v#S#T;n#T#o<v#o#q,a#q#s<v#s$f,a$f;'S<v;'S;=`>g<%l?Ah<v?Ah?BY,a?BY?Mn<v?MnO,a$Cy!AbP;=`<%l!=i$DR!AhP;=`<%l!2q$DR!Axm!x&j#^,U#c7[!hW!w`OX!CsXZ!EYZ[!Cs[^!EY^p!Cspq)qqr!Jxrs!EYsw!Jxwx!EYx!P!Jx!P!Q!Cs!Q![!Jx![!]!Cs!]!^7u!^!a!EY!a#S!Jx#S#T# [#T#o!Jx#o#q!Cs#q#r#'g#r#s!Jx#s$f!Cs$f;'S!Jx;'S;=`#+`<%l?Ah!Jx?Ah?BY!Cs?BY?Mn!Jx?MnO!Cs$3P!Czd#c7[!hWOX!CsXZ!EYZ[!Cs[^!EY^p!Cspq)qqr!Csrs!EYsw!Cswx!EYx!]!Cs!]!^!GV!^!a!EY!a#S!Cs#S#T!EY#T#q!Cs#q#r!Hk#r;'S!Cs;'S;=`!Jr<%lO!Cs#Js!E_X!hWOp!EYpq)qq!]!EY!]!^!Ez!^#q!EY#q#r!F_#r;'S!EY;'S;=`!GP<%lO!EY#Js!FRS!hW!k#JkO#q)q#r;'S)q;'S;=`*S<%lO)q#Jk!FbUOp!F_q!]!F_!]!^!Ft!^;'S!F_;'S;=`!Fy<%lO!F_#Jk!FyO!k#Jk#Jk!F|P;=`<%l!F_#Js!GSP;=`<%l!EY$3P!G`c#c7[!hW!k#JkOX*}XZ)qZ[*}[^)q^p*}pq)qqr*}rs)qsw*}wx)qx!^*}!^!a)q!a#S*}#S#T)q#T#q*}#q#r,a#r;'S*};'S;=`-[<%lO*}$2w!Hpa#c7[OX!HkXZ!F_Z[!Hk[^!F_^p!Hkqr!Hkrs!F_sw!Hkwx!F_x!]!Hk!]!^!Iu!^!a!F_!a#S!Hk#S#T!F_#T;'S!Hk;'S;=`!Jl<%lO!Hk$2w!I|Y#c7[!k#JkOX,aZ[,a^p,aqr,asw,ax!^,a!a#S,a#T;'S,a;'S;=`-U<%lO,a$2w!JoP;=`<%l!Hk$3P!JuP;=`<%l!Cs$DR!KVm!x&j#^,U#c7[!hW!w`OX!CsXZ!EYZ[!Cs[^!EY^p!Cspq)qqr!Jxrs!EYsw!Jxwx!EYx!P!Jx!P!Q!Cs!Q![!Jx![!]!Cs!]!^!MQ!^!a!EY!a#S!Jx#S#T# [#T#o!Jx#o#q!Cs#q#r#'g#r#s!Jx#s$f!Cs$f;'S!Jx;'S;=`#+`<%l?Ah!Jx?Ah?BY!Cs?BY?Mn!Jx?MnO!Cs$DR!Mam!x&j#^,U#c7[!hW!k#Jk!w`OX*}XZ)qZ[*}[^)q^p*}pq)qqr7urs)qsw7uwx)qx!P7u!P!Q*}!Q![7u![!]*}!]!^7u!^!a)q!a#S7u#S#T9}#T#o7u#o#q*}#q#r<v#r#s7u#s$f*}$f;'S7u;'S;=`>m<%l?Ah7u?Ah?BY*}?BY?Mn7u?MnO*}$-u# gg!x&j#^,U!hW!w`Op!EYpq)qqr# [rs!EYsw# [wx!EYx!P# [!P!Q!EY!Q![# [![!]!EY!]!^##O!^!a!EY!a#o# [#o#q!EY#q#r#$q#r#s# [#s$f!EY$f;'S# [;'S;=`#'a<%l?Ah# [?Ah?BY!EY?BY?Mn# [?MnO!EY$-u##]f!x&j#^,U!hW!k#Jk!w`Oq)qqr9}rs)qsw9}wx)qx!P9}!P!Q)q!Q![9}![!])q!]!^9}!^!a)q!a#o9}#o#q)q#q#r;n#r#s9}#s$f)q$f;'S9};'S;=`<p<%l?Ah9}?Ah?BY)q?BY?Mn9}?MnO)q$-m#$ze!x&j#^,U!w`Op!F_qr#$qrs!F_sw#$qwx!F_x!P#$q!P!Q!F_!Q![#$q![!]!F_!]!^#&]!^!a!F_!a#o#$q#o#q!F_#q#s#$q#s$f!F_$f;'S#$q;'S;=`#'Z<%l?Ah#$q?Ah?BY!F_?BY?Mn#$q?MnO!F_$-m#&hZ!x&j#^,U!k#Jk!w`qr;nsw;nx!P;n!Q![;n!]!^;n!a#o;n#q#s;n$f;'S;n;'S;=`<j<%l?Ah;n?BY?Mn;n$-m#'^P;=`<%l#$q$-u#'dP;=`<%l# [$Cy#'rk!x&j#^,U#c7[!w`OX!HkXZ!F_Z[!Hk[^!F_^p!Hkqr#'grs!F_sw#'gwx!F_x!P#'g!P!Q!Hk!Q![#'g![!]!Hk!]!^#)g!^!a!F_!a#S#'g#S#T#$q#T#o#'g#o#q!Hk#q#s#'g#s$f!Hk$f;'S#'g;'S;=`#+Y<%l?Ah#'g?Ah?BY!Hk?BY?Mn#'g?MnO!Hk$Cy#)tf!x&j#^,U#c7[!k#Jk!w`OX,aZ[,a^p,aqr<vsw<vx!P<v!P!Q,a!Q![<v![!],a!]!^<v!a#S<v#S#T;n#T#o<v#o#q,a#q#s<v#s$f,a$f;'S<v;'S;=`>g<%l?Ah<v?Ah?BY,a?BY?Mn<v?MnO,a$Cy#+]P;=`<%l#'g$DR#+cP;=`<%l!Jx$3R#+qZ$z#4`!iP$xMh!hWOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$Fy#,yps#v!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$Fy#/dpt#v!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$Fy#1}pu#v!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$DT#4fr!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx}5b}!O#6p!O!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VHi#7Pq!x&j#^,U!iP#c7[!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr#9Wrs(wsv#9Wvw#;mwx(wx!P#9W!P!Q'V!Q![#9W![!]'V!]!^#9W!^!_)q!_!`(w!`!a#IZ!a#S#9W#S#T#Bs#T#o#9W#o#p*}#p#q'V#q#r#Fp#r#s#9W#s$f'V$f;'S#9W;'S;=`#IT<%l?Ah#9W?Ah?BY'V?BY?Mn#9W?MnO'VHg#9ip!x&j#^,U!iP#c7[!hW#e`!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr#9Wrs(wsv#9Wvw#;mwx(wx!P#9W!P!Q'V!Q![#9W![!]'V!]!^#9W!^!_)q!_!a(w!a#S#9W#S#T#Bs#T#o#9W#o#p*}#p#q'V#q#r#Fp#r#s#9W#s$f'V$f;'S#9W;'S;=`#IT<%l?Ah#9W?Ah?BY'V?BY?Mn#9W?MnO'VHf#;|m!x&j#^,U#c7[!hW#e`!w`OX*}XZ)qZ[*}[^)q^p*}pq)qqr#;mrs)qsw#;mwx)qx!P#;m!P!Q*}!Q![#;m![!]*}!]!^#;m!^!a)q!a#S#;m#S#T#=w#T#o#;m#o#q*}#q#r#@t#r#s#;m#s$f*}$f;'S#;m;'S;=`#Bm<%l?Ah#;m?Ah?BY*}?BY?Mn#;m?MnO*}2Y#>Uf!x&j#^,U!hW#e`!w`Oq)qqr#=wrs)qsw#=wwx)qx!P#=w!P!Q)q!Q![#=w![!])q!]!^#=w!^!a)q!a#o#=w#o#q)q#q#r#?j#r#s#=w#s$f)q$f;'S#=w;'S;=`#@n<%l?Ah#=w?Ah?BY)q?BY?Mn#=w?MnO)q2Q#?uZ!x&j#^,U#e`!w`qr#?jsw#?jx!P#?j!Q![#?j!]!^#?j!a#o#?j#q#s#?j$f;'S#?j;'S;=`#@h<%l?Ah#?j?BY?Mn#?j2Q#@kP;=`<%l#?j2Y#@qP;=`<%l#=wH^#ARf!x&j#^,U#c7[#e`!w`OX,aZ[,a^p,aqr#@tsw#@tx!P#@t!P!Q,a!Q![#@t![!],a!]!^#@t!a#S#@t#S#T#?j#T#o#@t#o#q,a#q#s#@t#s$f,a$f;'S#@t;'S;=`#Bg<%l?Ah#@t?Ah?BY,a?BY?Mn#@t?MnO,aH^#BjP;=`<%l#@tHf#BpP;=`<%l#;m2Z#CSi!x&j#^,U!iP!hW#e`!w`Oq(wqr#Bsrs(wsv#Bsvw#=wwx(wx!P#Bs!P!Q(w!Q![#Bs![!](w!]!^#Bs!^!_)q!_!a(w!a#o#Bs#o#p)q#p#q(w#q#r#Dq#r#s#Bs#s$f(w$f;'S#Bs;'S;=`#Fj<%l?Ah#Bs?Ah?BY(w?BY?Mn#Bs?MnO(w2R#EOf!x&j#^,U!iP#e`!w`Oq*Yqr#Dqrs*Ysv#Dqvw#?jwx*Yx!P#Dq!P!Q*Y!Q![#Dq![!]*Y!]!^#Dq!_!a*Y!a#o#Dq#p#q*Y#q#s#Dq#s$f*Y$f;'S#Dq;'S;=`#Fd<%l?Ah#Dq?Ah?BY*Y?BY?Mn#Dq?MnO*Y2R#FgP;=`<%l#Dq2Z#FmP;=`<%l#BsH_#GPn!x&j#^,U!iP#c7[#e`!w`OX-bXZ*YZ[-b[^*Y^p-bpq*Yqr#Fprs*Ysv#Fpvw#@twx*Yx!P#Fp!P!Q-b!Q![#Fp![!]-b!]!^#Fp!_!a*Y!a#S#Fp#S#T#Dq#T#o#Fp#o#p,a#p#q-b#q#s#Fp#s$f-b$f;'S#Fp;'S;=`#H}<%l?Ah#Fp?Ah?BY-b?BY?Mn#Fp?MnO-bH_#IQP;=`<%l#FpHg#IWP;=`<%l#9WZ#IdZ!iP%OQ!hWOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$Ee#Jjq!x&j#^,U!iP#c7[$xMh${!LQ!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!P#Lq!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VIy#MQq!x&j#^,U!iP#c7[!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!P$ X!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VIy$ jp!s!b!x&j#^,U!iP#c7[!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!P5b!P!Q'V!Q![5b![!]'V!]!^5b!^!_)q!_!a(w!a#S5b#S#T>s#T#o5b#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f;'S5b;'S;=`D}<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$4y$#}hd!d!iP#c7[$xMh${!LQ!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!`(w!`!a$%i!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'Vm$%tZ!iP!hW#yd#idOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$4i$&xg$mSd!d!iP#c7[$xMh${!LQ!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V#Js$(jW$xMh${!LQ!hWOq)qqr$)Sr!a)q!a!b$2g!b#q)q#r;'S)q;'S;=`*S<%lO)qX$)XY!hWO})q}!O$)w!O!f)q!f!g$*s!g#W)q#W#X$/g#X#q)q#r;'S)q;'S;=`*S<%lO)qX$)|U!hWO})q}!O$*`!O#q)q#r;'S)q;'S;=`*S<%lO)qX$*gS!hW$}PO#q)q#r;'S)q;'S;=`*S<%lO)qX$*xU!hWO!q)q!q!r$+[!r#q)q#r;'S)q;'S;=`*S<%lO)qX$+aU!hWO!e)q!e!f$+s!f#q)q#r;'S)q;'S;=`*S<%lO)qX$+xU!hWO!v)q!v!w$,[!w#q)q#r;'S)q;'S;=`*S<%lO)qX$,aU!hWO!{)q!{!|$,s!|#q)q#r;'S)q;'S;=`*S<%lO)qX$,xU!hWO!r)q!r!s$-[!s#q)q#r;'S)q;'S;=`*S<%lO)qX$-aU!hWO!g)q!g!h$-s!h#q)q#r;'S)q;'S;=`*S<%lO)qX$-xV!hWO!`$-s!`!a$._!a#q$-s#q#r$.r#r;'S$-s;'S;=`$/a<%lO$-sX$.fS!hW$OPO#q)q#r;'S)q;'S;=`*S<%lO)qP$.uTO!`$.r!`!a$/U!a;'S$.r;'S;=`$/Z<%lO$.rP$/ZO$OPP$/^P;=`<%l$.rX$/dP;=`<%l$-sX$/lU!hWO#c)q#c#d$0O#d#q)q#r;'S)q;'S;=`*S<%lO)qX$0TU!hWO#V)q#V#W$0g#W#q)q#r;'S)q;'S;=`*S<%lO)qX$0lU!hWO#h)q#h#i$1O#i#q)q#r;'S)q;'S;=`*S<%lO)qX$1TU!hWO#m)q#m#n$1g#n#q)q#r;'S)q;'S;=`*S<%lO)qX$1lU!hWO#d)q#d#e$2O#e#q)q#r;'S)q;'S;=`*S<%lO)qX$2TU!hWO#X)q#X#Y$-s#Y#q)q#r;'S)q;'S;=`*S<%lO)qX$2lV!hWO!a$2g!a!b$3R!b#q$2g#q#r$4Q#r;'S$2g;'S;=`$5R<%lO$2gX$3WV!hWO!`$2g!`!a$3m!a#q$2g#q#r$4Q#r;'S$2g;'S;=`$5R<%lO$2gX$3tS!hW#{PO#q)q#r;'S)q;'S;=`*S<%lO)qP$4TTO!a$4Q!a!b$4d!b;'S$4Q;'S;=`$4{<%lO$4QP$4gTO!`$4Q!`!a$4v!a;'S$4Q;'S;=`$4{<%lO$4QP$4{O#{PP$5OP;=`<%l$4QX$5UP;=`<%l$2g#Jy$5fZ#_U!iP$xMh${!LQ!hWOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w#KX$6fZ!iP$xMh${!LQ!hW#idOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$IR$7v!afS#sQ!x&j#^,U#vp!iP#c7[v#t$xMh${!LQ$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O$;{!O!P$@`!P!Q'V!Q![$EO![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}$Ir!}#R5b#R#S$EO#S#T>s#T#o$Ir#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O$EO%O%WKp%W%o$EO%o%pKp%p&a$EO&a&bKp&b1p$EO1p4U$EO4U4d$EO4d4eKp4e$IS$EO$IS$I`Kp$I`$Ib$EO$Ib$JeKp$Je$Jg$EO$Jg$KhKp$Kh%#t$EO%#t&/xKp&/x&Et$EO&Et&FVKp&FV;'S$EO;'S;:j$Il;:j;=`!&[<%l?&rKp?&r?Ah$EO?Ah?BY!&b?BY?Mn$EO?MnO!&bHi$<^!^#sQ!x&j#^,U!iP#c7[!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx}5b}!O$;{!O!P$;{!P!Q'V!Q![$;{![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}$;{!}#R5b#R#S$;{#S#T>s#T#o$;{#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$}5b$}%O$;{%O%W5b%W%o$;{%o%p5b%p&a$;{&a&b5b&b1p$;{1p4U$;{4U4d$;{4d4e5b4e$IS$;{$IS$I`5b$I`$Ib$;{$Ib$Je5b$Je$Jg$;{$Jg$Kh5b$Kh%#t$;{%#t&/x5b&/x&Et$;{&Et&FV5b&FV;'S$;{;'S;:j$@Y;:j;=`D}<%l?&r5b?&r?Ah$;{?Ah?BY'V?BY?Mn$;{?MnO'VHi$@]P;=`<%l$;{K_$@s!a#sQ!x&j#^,U!iP#c7[v#t!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuNpuv5bvw7uwx(wx}5b}!O$;{!O!P$@`!P!Q'V!Q![$@`![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}$@`!}#R5b#R#S$@`#S#T>s#T#o$@`#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Np$}%O$@`%O%WNp%W%o$@`%o%pNp%p&a$@`&a&bNp&b1p$@`1p4U$@`4U4d$@`4d4eNp4e$IS$@`$IS$I`Np$I`$Ib$@`$Ib$JeNp$Je$Jg$@`$Jg$KhNp$Kh%#t$@`%#t&/xNp&/x&Et$@`&Et&FVNp&FV;'S$@`;'S;:j$Dx;:j;=`!#l<%l?&rNp?&r?Ah$@`?Ah?BY!#r?BY?Mn$@`?MnO!#rK_$D{P;=`<%l$@`Lu$Eg!afS#sQ!x&j#^,U!iP#c7[v#t$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O$;{!O!P$@`!P!Q'V!Q![$EO![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}$EO!}#R5b#R#S$EO#S#T>s#T#o$EO#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O$EO%O%WKp%W%o$EO%o%pKp%p&a$EO&a&bKp&b1p$EO1p4U$EO4U4d$EO4d4eKp4e$IS$EO$IS$I`Kp$I`$Ib$EO$Ib$JeKp$Je$Jg$EO$Jg$KhKp$Kh%#t$EO%#t&/xKp&/x&Et$EO&Et&FVKp&FV;'S$EO;'S;:j$Il;:j;=`!&[<%l?&rKp?&r?Ah$EO?Ah?BY!&b?BY?Mn$EO?MnO!&bLu$IoP;=`<%l$EOMg$J]!afS#sQ!x&j#^,U#vp!iP#c7[v#t$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O$;{!O!P$@`!P!Q'V!Q![$EO![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}$Ir!}#R5b#R#S$EO#S#T>s#T#o$Ir#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O$EO%O%WKp%W%o$EO%o%pKp%p&a$EO&a&bKp&b1p$EO1p4U$EO4U4d$EO4d4eKp4e$IS$EO$IS$I`Kp$I`$Ib$EO$Ib$JeKp$Je$Jg$EO$Jg$KhKp$Kh%#t$EO%#t&/xKp&/x&Et$EO&Et&FVKp&FV;'S$EO;'S;:j$Il;:j;=`!&[<%l?&rKp?&r?Ah$EO?Ah?BY!&b?BY?Mn$EO?MnO!&b$Ha$N}!afS!x&j#^,U!oQ!iP#c7[v#t$xMh${!LQ$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O%%S!O!P%)g!P!Q'V!Q![%.V![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}%.V!}#R5b#R#S%.V#S#T>s#T#o%.V#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O%.V%O%WKp%W%o%.V%o%pKp%p&a%.V&a&bKp&b1p%.V1p4U%.V4U4d%.V4d4eKp4e$IS%.V$IS$I`Kp$I`$Ib%.V$Ib$JeKp$Je$Jg%.V$Jg$KhKp$Kh%#t%.V%#t&/xKp&/x&Et%.V&Et&FVKp&FV;'S%.V;'S;:j%2s;:j;=`!&[<%l?&rKp?&r?Ah%.V?Ah?BY!&b?BY?Mn%.V?MnO!&bHi%%e!^!x&j#^,U!oQ!iP#c7[!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx}5b}!O%%S!O!P%%S!P!Q'V!Q![%%S![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}%%S!}#R5b#R#S%%S#S#T>s#T#o%%S#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$}5b$}%O%%S%O%W5b%W%o%%S%o%p5b%p&a%%S&a&b5b&b1p%%S1p4U%%S4U4d%%S4d4e5b4e$IS%%S$IS$I`5b$I`$Ib%%S$Ib$Je5b$Je$Jg%%S$Jg$Kh5b$Kh%#t%%S%#t&/x5b&/x&Et%%S&Et&FV5b&FV;'S%%S;'S;:j%)a;:j;=`D}<%l?&r5b?&r?Ah%%S?Ah?BY'V?BY?Mn%%S?MnO'VHi%)dP;=`<%l%%SK_%)z!a!x&j#^,U!oQ!iP#c7[v#t!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuNpuv5bvw7uwx(wx}5b}!O%%S!O!P%)g!P!Q'V!Q![%)g![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}%)g!}#R5b#R#S%)g#S#T>s#T#o%)g#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Np$}%O%)g%O%WNp%W%o%)g%o%pNp%p&a%)g&a&bNp&b1p%)g1p4U%)g4U4d%)g4d4eNp4e$IS%)g$IS$I`Np$I`$Ib%)g$Ib$JeNp$Je$Jg%)g$Jg$KhNp$Kh%#t%)g%#t&/xNp&/x&Et%)g&Et&FVNp&FV;'S%)g;'S;:j%.P;:j;=`!#l<%l?&rNp?&r?Ah%)g?Ah?BY!#r?BY?Mn%)g?MnO!#rK_%.SP;=`<%l%)gLu%.n!afS!x&j#^,U!oQ!iP#c7[v#t$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O%%S!O!P%)g!P!Q'V!Q![%.V![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}%.V!}#R5b#R#S%.V#S#T>s#T#o%.V#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O%.V%O%WKp%W%o%.V%o%pKp%p&a%.V&a&bKp&b1p%.V1p4U%.V4U4d%.V4d4eKp4e$IS%.V$IS$I`Kp$I`$Ib%.V$Ib$JeKp$Je$Jg%.V$Jg$KhKp$Kh%#t%.V%#t&/xKp&/x&Et%.V&Et&FVKp&FV;'S%.V;'S;:j%2s;:j;=`!&[<%l?&rKp?&r?Ah%.V?Ah?BY!&b?BY?Mn%.V?MnO!&bLu%2vP;=`<%l%.V$-u%3[i!x&j#^,U!iP$xMh${!LQ!hW!w`Oq(wqr>srs(wsv>svw9}wx(wx!P>s!P!Q(w!Q![>s![!](w!]!^>s!^!_)q!_!a(w!a#o>s#o#p)q#p#q(w#q#r@o#r#s>s#s$f(w$f;'S>s;'S;=`Bf<%l?Ah>s?Ah?BY(w?BY?Mn>s?MnO(w$IR%5h!afS!x&j#^,U#vp!oQ!iP#c7[v#t$xMh${!LQ$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O%%S!O!P%)g!P!Q'V!Q![%.V![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}%9m!}#R5b#R#S%.V#S#T>s#T#o%9m#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O%.V%O%WKp%W%o%.V%o%pKp%p&a%.V&a&bKp&b1p%.V1p4U%.V4U4d%.V4d4eKp4e$IS%.V$IS$I`Kp$I`$Ib%.V$Ib$JeKp$Je$Jg%.V$Jg$KhKp$Kh%#t%.V%#t&/xKp&/x&Et%.V&Et&FVKp&FV;'S%.V;'S;:j%2s;:j;=`!&[<%l?&rKp?&r?Ah%.V?Ah?BY!&b?BY?Mn%.V?MnO!&bMg%:W!afS!x&j#^,U#vp!oQ!iP#c7[v#t$i!b!hW!w`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuKpuv5bvw7uwx(wx}5b}!O%%S!O!P%)g!P!Q'V!Q![%.V![!]'V!]!^5b!^!_)q!_!a(w!a!c5b!c!}%9m!}#R5b#R#S%.V#S#T>s#T#o%9m#o#p*}#p#q'V#q#rBl#r#s5b#s$f'V$f$g5b$g$}Kp$}%O%.V%O%WKp%W%o%.V%o%pKp%p&a%.V&a&bKp&b1p%.V1p4U%.V4U4d%.V4d4eKp4e$IS%.V$IS$I`Kp$I`$Ib%.V$Ib$JeKp$Je$Jg%.V$Jg$KhKp$Kh%#t%.V%#t&/xKp&/x&Et%.V&Et&FVKp&FV;'S%.V;'S;:j%2s;:j;=`!&[<%l?&rKp?&r?Ah%.V?Ah?BY!&b?BY?Mn%.V?MnO!&b$3a%>dSc$3X!hWO#q)q#r;'S)q;'S;=`*S<%lO)q$3T%?Pg#]S!iP#c7[$xMh${!LQ!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V$H]%@{nh%b!x&j#^,U!iP#c7[$xMh${!LQ!w`OX-bXZ*YZ[-b[^*Y^p-bpq*YqrBlrs*YsvBlvw<vwx*Yx!PBl!P!Q-b!Q![Bl![!]-b!]!^Bl!_!a*Y!a#SBl#S#T@o#T#oBl#o#p,a#p#q-b#q#sBl#s$f-b$f;'SBl;'S;=`Dw<%l?AhBl?Ah?BY-b?BY?MnBl?MnO-b$Ha%B|P;=`<%l$Nb$H_%CSP;=`<%lHl$7]%CjqfS!iP#c7[v#t$xMh${!LQ$i!b!hWOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'Vtu!&buv'Vvw*}wx(wx!O'V!O!P!#r!P!Q'V!Q![!&b![!^'V!^!_)q!_!a(w!a!c'V!c!}!&b!}#R'V#R#S!&b#S#T(w#T#o!&b#o#p*}#p#q'V#q#r-b#r$g'V$g;'S!&b;'S;=`!(x<%lO!&b",
  tokenizers: [Qt, yt, Wt, xt, Mt, Dt, Gt, Ft, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  topRules: { Document: [0, 16] },
  specialized: [{ term: 20, get: (e) => Ht[e] || -1 }, { term: 22, get: (e) => Lt[e] || -1 }, { term: 163, get: (e) => zt[e] || -1 }, { term: 85, get: (e) => eO[e] || -1 }, { term: 77, get: (e) => tO[e] || -1 }],
  tokenPrec: 2402
});
function ue(e, t, O = e.length) {
  if (!t)
    return "";
  const n = t.firstChild, a = n && (n.getChild("TagName") ?? n.getChild("ComponentName") ?? n.getChild("SvelteElementName"));
  return a ? e.sliceString(a.from, Math.min(a.to, O)) : "";
}
const nO = tt.inputHandler.of((e, t, O, n) => {
  if (e.composing || e.state.readOnly || t !== O || n !== ">" && n !== "/")
    return !1;
  const { state: a } = e, r = a.changeByRange((o) => {
    const { head: s } = o;
    let c = Z(a).resolveInner(s, -1), p;
    for (; c && c.name !== "OpenTag"; )
      c = c.parent;
    if (!c)
      return { range: o };
    p = ue(a.doc, c.parent, s);
    const b = a.doc.sliceString(s, s + 1);
    if (n === ">" && // Ensure there is no closing tag already
    (c.parent?.lastChild?.name !== "CloseTag" || b !== "<") && p) {
      const x = b === ">", E = `${x ? "" : ">"}</${p}>`;
      return {
        range: re.cursor(s + 1),
        changes: { from: s + (x ? 1 : 0), insert: E }
      };
    }
    const ne = c.parent, ae = ne?.parent;
    if (p = ue(a.doc, ae, s), n === "/" && ne?.from === s - 1 && ae?.lastChild?.name !== "CloseTag" && p) {
      const x = e.state.doc.sliceString(s, s + 1) === ">", E = `/${p}${x ? "" : ">"}`, Ze = s + E.length + (x ? 1 : 0);
      return {
        range: re.cursor(Ze),
        changes: { from: s, insert: E }
      };
    }
    return { range: o };
  });
  return r.changes.empty ? !1 : (e.dispatch(r, { userEvent: "input.type", scrollIntoView: !0 }), !0);
});
function aO(e, t) {
  const O = /* @__PURE__ */ Object.create(null), n = (
    // The firstChild is the open tag node
    e.firstChild?.getChildren("Attribute") ?? []
  );
  for (const a of n) {
    const r = a.getChild("AttributeName"), o = a.getChild("AttributeValue") ?? a.getChild("UnquotedAttributeValue");
    r && (O[t.read(r.from, r.to)] = o ? o.name == "AttributeValue" ? t.read(o.from + 1, o.to - 1) : t.read(o.from, o.to) : "");
  }
  return O;
}
function K(e, t, O) {
  const { node: n } = e, { from: a, to: r } = n, o = n.parent;
  if (!o)
    return null;
  const s = aO(o, t);
  for (const c of O)
    if (!c.attributeMatcher || c.attributeMatcher(s))
      return {
        parser: c.parser,
        overlay: [{ from: a, to: r }]
      };
  return null;
}
function rO(e) {
  for (const { attributeMatcher: t, parser: O } of e)
    if (!t || t({ type: "text/javascript" }))
      return O;
  return L.parser;
}
function oO(e) {
  const t = [], O = [], n = [];
  for (const a of e) {
    const { tag: r } = a;
    (r === "script" ? t : r === "style" ? O : n).push(a);
  }
  return Ot((a, r) => {
    const o = a.type.id;
    return o === D || o === G || o === Y ? { parser: rO(t) } : o === ht ? K(a, r, t) : o === ut ? K(a, r, O) : o === wt ? K(a, r, n) : null;
  });
}
const lO = [
  { label: "onabort" },
  { label: "onanimationcancel" },
  { label: "onanimationend" },
  { label: "onanimationiteration" },
  { label: "onanimationstart" },
  { label: "onauxclick" },
  { label: "onbeforeinput" },
  { label: "onblur" },
  { label: "oncancel" },
  { label: "oncanplay" },
  { label: "oncanplaythrough" },
  { label: "onchange" },
  { label: "onclick" },
  { label: "onclose" },
  { label: "oncontextmenu" },
  { label: "oncopy" },
  { label: "oncuechange" },
  { label: "oncut" },
  { label: "ondblclick" },
  { label: "ondrag" },
  { label: "ondragend" },
  { label: "ondragenter" },
  { label: "ondragleave" },
  { label: "ondragover" },
  { label: "ondragstart" },
  { label: "ondrop" },
  { label: "ondurationchange" },
  { label: "onemptied" },
  { label: "onended" },
  { label: "onerror" },
  { label: "onfocus" },
  { label: "onformdata" },
  { label: "ongotpointercapture" },
  { label: "oninput" },
  { label: "oninvalid" },
  { label: "onkeydown" },
  { label: "onkeypress" },
  { label: "onkeyup" },
  { label: "onload" },
  { label: "onloadeddata" },
  { label: "onloadedmetadata" },
  { label: "onloadstart" },
  { label: "onlostpointercapture" },
  { label: "onmousedown" },
  { label: "onmouseenter" },
  { label: "onmouseleave" },
  { label: "onmousemove" },
  { label: "onmouseout" },
  { label: "onmouseover" },
  { label: "onmouseup" },
  { label: "onpaste" },
  { label: "onpause" },
  { label: "onplay" },
  { label: "onplaying" },
  { label: "onpointercancel" },
  { label: "onpointerdown" },
  { label: "onpointerenter" },
  { label: "onpointerleave" },
  { label: "onpointermove" },
  { label: "onpointerout" },
  { label: "onpointerover" },
  { label: "onpointerup" },
  { label: "onprogress" },
  { label: "onratechange" },
  { label: "onreset" },
  { label: "onresize" },
  { label: "onscroll" },
  { label: "onsecuritypolicyviolation" },
  { label: "onseeked" },
  { label: "onseeking" },
  { label: "onselect" },
  { label: "onselectionchange" },
  { label: "onselectstart" },
  { label: "onslotchange" },
  { label: "onstalled" },
  { label: "onsubmit" },
  { label: "onsuspend" },
  { label: "ontimeupdate" },
  { label: "ontoggle" },
  { label: "ontouchcancel" },
  { label: "ontouchend" },
  { label: "ontouchmove" },
  { label: "ontouchstart" },
  { label: "ontransitioncancel" },
  { label: "ontransitionend" },
  { label: "ontransitionrun" },
  { label: "ontransitionstart" },
  { label: "onvolumechange" },
  { label: "onwaiting" },
  { label: "onwebkitanimationend" },
  { label: "onwebkitanimationiteration" },
  { label: "onwebkitanimationstart" },
  { label: "onwebkittransitionend" },
  { label: "onwheel" }
], sO = [
  {
    label: "onintrostart",
    info: "Available when element has transition"
  },
  {
    label: "onintroend",
    info: "Available when element has transition"
  },
  {
    label: "onoutrostart",
    info: "Available when element has transition"
  },
  {
    label: "onoutroend",
    info: "Available when element has transition"
  }
], iO = [
  {
    label: "bind:innerHTML",
    info: "Available when contenteditable=true"
  },
  {
    label: "bind:textContent",
    info: "Available when contenteditable=true"
  },
  {
    label: "bind:innerText",
    info: "Available when contenteditable=true"
  },
  {
    label: "bind:clientWidth",
    info: "Available on all visible elements. (read-only)"
  },
  {
    label: "bind:clientHeight",
    info: "Available on all visible elements. (read-only)"
  },
  {
    label: "bind:offsetWidth",
    info: "Available on all visible elements. (read-only)"
  },
  {
    label: "bind:offsetHeight",
    info: "Available on all visible elements. (read-only)"
  },
  {
    label: "bind:this",
    info: "To get a reference to a DOM node, use bind:this. If used on a component, gets a reference to that component instance."
  }
], je = [
  {
    label: "data-sveltekit-keepfocus",
    info: "SvelteKit-specific attribute. Currently focused element will retain focus after navigation. Otherwise, focus will be reset to the body.",
    valueType: "constant",
    values: [{ label: "off" }]
  },
  {
    label: "data-sveltekit-noscroll",
    info: "SvelteKit-specific attribute. Will prevent scrolling after the link is clicked.",
    valueType: "constant",
    values: [{ label: "off" }]
  },
  {
    label: "data-sveltekit-preload-code",
    info: "SvelteKit-specific attribute. Will cause SvelteKit to run the page's load function as soon as the user hovers over the link (on a desktop) or touches it (on mobile), rather than waiting for the click event to trigger navigation.",
    valueType: "constant",
    values: [
      { label: "eager" },
      { label: "viewport" },
      { label: "hover" },
      { label: "tap" },
      { label: "off" }
    ]
  },
  {
    label: "data-sveltekit-preload-data",
    info: "SvelteKit-specific attribute. Will cause SvelteKit to run the page's load function as soon as the user hovers over the link (on a desktop) or touches it (on mobile), rather than waiting for the click event to trigger navigation.",
    valueType: "constant",
    values: [{ label: "hover" }, { label: "tap" }, { label: "off" }]
  },
  {
    label: "data-sveltekit-reload",
    info: "SvelteKit-specific attribute. Will cause SvelteKit to do a normal browser navigation which results in a full page reload.",
    valueType: "constant",
    values: [{ label: "off" }]
  },
  {
    label: "data-sveltekit-replacestate",
    info: "SvelteKit-specific attribute. Will replace the current `history` entry rather than creating a new one with `pushState` when the link is clicked.",
    valueType: "constant",
    values: [{ label: "off" }]
  }
], ee = [
  {
    label: "svelte:self",
    info: `Allows a component to include itself, recursively.

It cannot appear at the top level of your markup; it must be inside an if or each block to prevent an infinite loop.`,
    deprecated: !0,
    boost: -1
  },
  {
    label: "svelte:component",
    info: `Renders a component dynamically, using the component constructor specified as the this property. When the property changes, the component is destroyed and recreated.

If this is falsy, no component is rendered.`,
    deprecated: !0,
    boost: -1,
    attributes: [
      {
        label: "this",
        info: `Component to render.

When this property changes, the component is destroyed and recreated.
If this is falsy, no component is rendered.`
      }
    ]
  },
  {
    label: "svelte:element",
    info: `Renders a DOM element dynamically, using the string as the this property. When the property changes, the element is destroyed and recreated.

If this is falsy, no element is rendered.`,
    attributes: [
      {
        label: "this",
        info: `DOM element to render.

When this property changes, the element is destroyed and recreated.
If this is falsy, no element is rendered.`
      }
    ]
  },
  {
    label: "svelte:window",
    info: "Allows you to add event listeners to the window object without worrying about removing them when the component is destroyed, or checking for the existence of window when server-side rendering.",
    attributes: [
      {
        label: "bind:innerWidth",
        info: "Bind to the inner width of the window. (read-only)"
      },
      {
        label: "bind:innerHeight",
        info: "Bind to the inner height of the window. (read-only)"
      },
      {
        label: "bind:outerWidth",
        info: "Bind to the outer width of the window. (read-only)"
      },
      {
        label: "bind:outerHeight",
        info: "Bind to the outer height of the window. (read-only)"
      },
      {
        label: "bind:scrollX",
        info: "Bind to the scroll x position of the window."
      },
      {
        label: "bind:scrollY",
        info: "Bind to the scroll y position of the window."
      },
      {
        label: "bind:online",
        info: "An alias for window.navigator.onLine"
      },
      // window events
      { label: "onafterprint" },
      { label: "onbeforeprint" },
      { label: "onbeforeunload" },
      { label: "ongamepadconnected" },
      { label: "ongamepaddisconnected" },
      { label: "onhashchange" },
      { label: "onlanguagechange" },
      { label: "onmessage" },
      { label: "onmessageerror" },
      { label: "onoffline" },
      { label: "ononline" },
      { label: "onpagehide" },
      { label: "onpageshow" },
      { label: "onpopstate" },
      { label: "onrejectionhandled" },
      { label: "onstorage" },
      { label: "onunhandledrejection" },
      { label: "onunload" }
    ]
  },
  {
    label: "svelte:document",
    info: "As with <svelte:window>, this element allows you to add listeners to events on document, such as visibilitychange, which don't fire on window.",
    attributes: [
      // document events
      { label: "onfullscreenchange" },
      { label: "onfullscreenerror" },
      { label: "onpointerlockchange" },
      { label: "onpointerlockerror" },
      { label: "onreadystatechange" },
      { label: "onvisibilitychange" }
    ]
  },
  {
    label: "svelte:body",
    info: "As with <svelte:window>, this element allows you to add listeners to events on document.body, such as mouseenter and mouseleave which don't fire on window."
  },
  {
    label: "svelte:boundary",
    info: "Boundaries allow you to 'wall off' parts of your app",
    attributes: [
      {
        label: "onerror",
        info: "An error handler, will be called with the same arguments as the `failed` snippet. This is useful for tracking the error with an error reporting service."
      },
      {
        label: "failed",
        info: "A fail snippet, it will be rendered when an error is thrown inside the boundary, with the error and a reset function that recreates the contents."
      },
      {
        label: "pending",
        info: "A pending snippet. It will be will be shown when the boundary is first created, and will remain visible until all the await expressions inside the boundary have resolved."
      }
    ]
  },
  {
    label: "svelte:head",
    info: "This element makes it possible to insert elements into document.head. During server-side rendering, head content exposed separately to the main html content."
  },
  {
    label: "svelte:options",
    info: "Provides a place to specify per-component compiler options",
    attributes: [
      {
        label: "runes",
        info: "If true, forces a component into runes mode."
      },
      {
        label: "namespace",
        info: "The namespace where this component will be used.",
        valueType: "constant",
        values: [{ label: "html", info: "The default." }, { label: "svg" }, { label: "mathml" }]
      },
      {
        label: "customElement",
        info: "The options to use when compiling this component as a custom element. If a string is passed, it is used as the tag option"
      },
      {
        label: "css",
        valueType: "constant",
        values: [
          {
            label: "injected",
            info: "The component will inject its styles inline: During server-side rendering, it's injected as a <style> tag in the head, during client side rendering, it's loaded via JavaScript"
          }
        ]
      },
      {
        label: "immutable",
        info: "If true, tells the compiler that you promise not to mutate any objects. This allows it to be less conservative about checking whether values have changed.",
        deprecated: !0,
        boost: -1,
        values: [
          {
            label: "true",
            info: "You never use mutable data, so the compiler can do simple referential equality checks to determine if values have changed"
          },
          {
            label: "false",
            info: "The default. Svelte will be more conservative about whether or not mutable objects have changed"
          }
        ]
      },
      {
        label: "accessors",
        deprecated: !0,
        boost: -1,
        info: "If true, getters and setters will be created for the component's props. If false, they will only be created for readonly exported values (i.e. those declared with const, class and function). If compiling with customElement: true this option defaults to true."
      },
      {
        label: "tag",
        info: "The name to use when compiling this component as a custom element"
      }
    ]
  },
  {
    label: "svelte:fragment",
    info: "This element is useful if you want to assign a component to a named slot without creating a wrapper DOM element.",
    deprecated: !0,
    boost: -1,
    attributes: [
      {
        label: "slot",
        info: "The name of the named slot that should be targeted."
      }
    ]
  }
  // This never worked for the autocomplete as the HTML automcomplete already provided one, (and was filtered)
  // Will remove after <slot> support is completely dropped, keeped for reference
  // {
  //   label: 'slot',
  //   info:
  //     'Components can have child content, in the same way that elements can.\n\nThe content is exposed in the child component using the <slot> element, which can contain fallback content that is rendered if no children are provided.',
  //   attributes: [
  //     {
  //       label: 'name',
  //       info:
  //         'Named slots allow consumers to target specific areas. They can also have fallback content.',
  //     },
  //   ],
  // },
], we = [
  {
    label: "bind:duration",
    info: "The total duration of the video, in seconds. (readonly)"
  },
  {
    label: "bind:buffered",
    info: "An array of {start, end} objects. (readonly)"
  },
  {
    label: "bind:seekable",
    info: "An array of {start, end} objects. (readonly)"
  },
  {
    label: "bind:played",
    info: "An array of {start, end} objects. (readonly)"
  },
  {
    label: "bind:seeking",
    info: "boolean. (readonly)"
  },
  {
    label: "bind:ended",
    info: "boolean. (readonly)"
  },
  {
    label: "bind:currentTime",
    info: "The current point in the video, in seconds."
  },
  {
    label: "bind:playbackRate",
    info: "how fast or slow to play the video, where 1 is 'normal'"
  },
  {
    label: "bind:paused"
  },
  {
    label: "bind:volume",
    info: "A value between 0 and 1"
  },
  {
    label: "bind:muted"
  },
  {
    label: "bind:readyState"
  }
], pO = [
  {
    label: "bind:videoWidth",
    info: "readonly"
  },
  {
    label: "bind:videoHeight",
    info: "readonly"
  }
], fe = {
  label: "indeterminate",
  info: 'Available for type="checkbox"'
}, Ne = [
  {
    label: "select",
    attributes: [{ label: "bind:value" }]
  },
  {
    label: "input",
    attributes: [
      { label: "bind:value" },
      {
        label: "bind:group",
        info: 'Available for type="radio" and type="checkbox"'
      },
      { label: "bind:checked", info: 'Available for type="checkbox"' },
      {
        label: "bind:files",
        info: 'Available for type="file" (readonly)'
      },
      fe,
      { ...fe, label: "bind:indeterminate" }
    ]
  },
  {
    label: "img",
    attributes: [{ label: "bind:naturalWidth" }, { label: "bind:naturalHeight" }]
  },
  {
    label: "textarea",
    attributes: [{ label: "bind:value" }]
  },
  {
    label: "video",
    attributes: [...we, ...pO]
  },
  {
    label: "audio",
    attributes: [...we]
  },
  {
    label: "details",
    attributes: [{ label: "bind:open" }]
  },
  {
    label: "script",
    attributes: [{ label: "lang", values: [{ label: "ts" }], valueType: "text" }]
  }
], Q = (e) => {
  let t = e.parent;
  if (e.name === "." || e.name === "PropertyName") {
    if (t?.name !== "MemberExpression") return !1;
    t = t.parent;
  }
  return t ? t.name === "VariableDeclaration" || t.name === "PropertyDeclaration" : !1;
}, P = (e) => {
  let t = e.parent;
  if (e.name === "." || e.name === "PropertyName") {
    if (t?.name !== "MemberExpression") return !1;
    t = t.parent;
  }
  return t?.name !== "CallExpression" || (t = t.parent, !t) ? !1 : t.name === "VariableDeclaration" || t.name === "PropertyDeclaration";
}, y = (e) => e.name === "VariableName" ? e.parent?.name === "ExpressionStatement" : e.name === "." || e.name === "PropertyName" ? e.parent?.parent?.name === "ExpressionStatement" : !1, de = (e) => e.name === "VariableName" && e.parent?.name === "VariableDeclaration" && e.parent.parent?.name === "Script", cO = (e, t) => {
  if (e.parent?.name !== "PatternProperty" || e.parent.parent?.name !== "ObjectPattern" || e.parent.parent.parent?.name !== "VariableDeclaration") return !1;
  let O = e.parent.parent.parent.lastChild;
  return !O || O.name === "ObjectPattern" || O.name === "Equals" || O.name === "⚠" || O.name === ";" && (O = O.prevSibling, !O || O.name === "⚠") ? !0 : O.name === "CallExpression" && O.firstChild?.name === "VariableName" && t.state.sliceDoc(O.firstChild.from, O.firstChild.to) === "$props";
}, $O = (e, t) => P(e) && e.parent?.parent?.parent?.parent?.name === "Script", Se = [
  { snippet: "$state(${})", test: Q },
  { snippet: "$state", test: P },
  { snippet: "$props()", test: de },
  { snippet: "$props.id", test: $O },
  { snippet: "$props.id()", test: de },
  { snippet: "$derived(${});", test: Q },
  { snippet: "$derived", test: P },
  { snippet: `$derived.by(() => {
	\${}
});`, test: Q },
  { snippet: "$derived.by", test: P },
  { snippet: `$effect(() => {
	\${}
});`, test: y },
  { snippet: `$effect.pre(() => {
	\${}
});`, test: y },
  { snippet: "$state.raw(${});", test: Q },
  { snippet: "$state.raw", test: P },
  { snippet: "$state.eager(${});", test: Q },
  { snippet: "$state.eager", test: P },
  { snippet: "$bindable()", test: cO },
  { snippet: `$effect.root(() => {
	\${}
})` },
  { snippet: "$state.snapshot(${})" },
  { snippet: "$effect.tracking()" },
  { snippet: "$effect.pending()" },
  { snippet: "$inspect(${});", test: y },
  { snippet: "$inspect.trace();", test: y },
  { snippet: "$inspect.trace(${});", test: y },
  { snippet: "$host()" }
], bO = [
  { snippet: "#if ${}}\n	${}\n{/if", label: "#if" },
  { snippet: "#each ${} as ${}}\n	${}\n{/each", label: "#each" },
  { snippet: "#await ${} then ${}}\n	${}\n{/await", label: "#await then" },
  { snippet: "#await ${} catch ${}}\n	${}\n{/await", label: "#await catch" },
  {
    snippet: "#await ${}}\n	${}\n{:then ${}}\n	${}\n{/await",
    label: "#await :then"
  },
  { snippet: "#key ${}}\n	${}\n{/key", label: "#key" },
  { snippet: "#snippet ${}()}\n	${}\n{/snippet", label: "#snippet" }
], hO = [
  { snippet: "@html ${}", label: "@html" },
  { snippet: "@debug ${}", label: "@debug" },
  { snippet: "@const ${}", label: "@const" },
  { snippet: "@render ${}", label: "@render" }
], uO = [{ snippet: "@attach ${}", label: "@attach" }], wO = bO.map(({ snippet: e, label: t }) => V(e, { label: t, type: "snippet" })), fO = hO.map(({ snippet: e, label: t }) => V(e, { label: t, type: "snippet" })), dO = uO.map(({ snippet: e, label: t }) => V(e, { label: t, type: "snippet" }));
function A(e, t) {
  return t ? e.state.doc.sliceString(t.from, t.to) : null;
}
function qe(e, t) {
  const O = e.state.doc.sliceString(t.from, t.from + 1), n = t.parent, a = t.parent?.parent, r = t.from, o = e.pos, s = "keyword", c = {
    from: r,
    to: o
  };
  return Ae(O).with("/", () => {
    const p = (b) => ({
      ...c,
      options: [{ label: b, type: s }],
      validFor: /^\/\w*$/
    });
    return n?.name === "EachBlockClose" || a?.name === "EachBlock" ? p("/each") : n?.name === "IfBlockClose" || a?.name === "IfBlock" ? p("/if") : n?.name === "AwaitBlockClose" || a?.name === "AwaitBlock" ? p("/await") : n?.name === "KeyBlockClose" || a?.name === "KeyBlock" ? p("/key") : null;
  }).with(":", () => {
    const p = (b) => ({
      ...c,
      options: b,
      validFor: /^:\w*$/
    });
    return n?.name === "ElseBlock" || a?.name === "IfBlock" ? p([
      { label: ":else", type: s },
      { label: ":else if ", type: s }
    ]) : n?.name === "ThenBlock" || a?.name === "AwaitBlock" ? p([
      { label: ":then", type: s },
      { label: ":catch", type: s }
    ]) : null;
  }).with("#", () => ({
    from: r,
    to: o,
    options: wO,
    validFor: /^#(\w)*$/
  })).with("@", () => {
    const p = t.parent?.parent?.name;
    return {
      ...c,
      options: p === "SelfClosingTag" || p === "OpenTag" ? dO : fO,
      validFor: /^@(\w)*$/
    };
  }).otherwise(() => null);
}
function B(e) {
  return e.reduce((t, { label: O, valueType: n, info: a, deprecated: r, boost: o }) => {
    const s = n === "constant" ? '"${}"' : "{${}}", c = {
      info: a,
      boost: o,
      detail: r ? "deprecated" : void 0,
      type: "snippet"
    };
    if (t.push(
      V(`${O}=${s}`, {
        ...c,
        label: O
      })
    ), !O.startsWith("on"))
      return t;
    const p = O.replace(/^on/, "on:");
    return t.push(
      V(`${p}=${s}`, {
        ...c,
        label: p,
        detail: "deprecated",
        // The on: directive is deprecated, so we lower its priority
        boost: -1
      })
    ), t;
  }, []);
}
function Re(e) {
  return e.reduce((t, { label: O, attributes: n }) => (!n || n.length === 0 || t.set(O, B(n)), t), /* @__PURE__ */ new Map());
}
const SO = B(lO), qO = B(sO), mO = B(je), gO = B(iO), vO = ee.map(({ label: e, deprecated: t, info: O, boost: n }) => ({
  label: e,
  info: O,
  detail: t ? "deprecated" : void 0,
  boost: n,
  type: "type"
})), me = Re(ee), VO = Re(Ne), PO = je.reduce((e, { label: t, values: O }) => (O && e.set(
  t,
  O.map(({ label: n, info: a, boost: r }) => ({
    label: n,
    info: a,
    boost: r,
    type: "constant"
  }))
), e), /* @__PURE__ */ new Map()), TO = ee.reduce((e, { attributes: t, label: O }) => {
  if (!t || t.length === 0)
    return e;
  for (const n of t)
    n.values && e.set(
      `${O}/${n.label}`,
      n.values.map(({ label: a, info: r, boost: o }) => ({
        label: a,
        info: r,
        boost: o,
        type: "constant"
      }))
    );
  return e;
}, /* @__PURE__ */ new Map()), xO = Ne.reduce(
  (e, { attributes: t, label: O }) => {
    if (!t || t.length === 0)
      return e;
    for (const n of t)
      n.values && e.set(
        `${O}/${n.label}`,
        n.values.map(({ label: a, info: r, boost: o }) => ({
          label: a,
          info: r,
          boost: o,
          type: "constant"
        }))
      );
    return e;
  },
  /* @__PURE__ */ new Map()
);
function ge(e, t) {
  if (!t)
    return null;
  const O = (s) => ({ from: t.from, to: e.pos, options: s, validFor: /^\w*:?$/ }), n = [
    ...SO,
    ...qO,
    ...gO,
    ...mO
  ], a = t.parent?.parent?.firstChild?.nextSibling, r = A(e, a);
  if (a?.name === "SvelteElementName" && // This check is technically not needed if the parser is correct, but just in case
  r && /^svelte:(options|boundary)/.test(r))
    return O(me.get(r) ?? []);
  if (a?.name === "SvelteElementName" && // This check is technically not needed if the parser is correct, but just in case
  r)
    return O([
      ...me.get(r) ?? [],
      ...n
    ]);
  const o = VO.get(r ?? "");
  return a?.name === "TagName" && o ? O([...n, ...o]) : O(n);
}
function te(e, t, O, n) {
  const a = O.get(n);
  if (!a)
    return null;
  const { from: r, name: o } = t, c = o === "UnquotedAttributeValue" || o === "Is" ? a.map((p) => ({ ...p, apply: `"${p.label}"` })) : a;
  return {
    from: o === "Is" ? r + 1 : r,
    to: e.pos,
    options: c,
    validFor: o === "Is" ? /^[^\s<>='"]*$/ : /^\w*$/
  };
}
function QO(e) {
  const t = e.name === "TagName";
  return {
    from: t ? e.from : e.from - 7,
    options: vO,
    validFor: t ? /^sve\w*:?$/ : /^svelte:\w*$/
  };
}
function Oe(e, t) {
  let O = t.parent;
  for (; O && O.firstChild?.name !== "AttributeName"; )
    O = O.parent;
  const n = O?.firstChild;
  return n ? A(e, n) : null;
}
function yO(e, t) {
  const O = Oe(e, t);
  return O?.startsWith("data-sveltekit-") ? te(
    e,
    t,
    PO,
    O
  ) : null;
}
function WO(e, t) {
  let O = t.parent;
  for (; O && !O.getChild("SvelteElementName"); )
    O = O.parent;
  const n = O?.getChild("SvelteElementName");
  if (!n)
    return null;
  const a = A(e, n), r = Oe(e, t);
  return r ? te(
    e,
    t,
    TO,
    `${a}/${r}`
  ) : null;
}
function kO(e, t) {
  let O = t.parent;
  for (; O && !O.getChild("TagName"); )
    O = O.parent;
  const n = O?.getChild("TagName");
  if (!n)
    return null;
  const a = A(e, n), r = Oe(e, t);
  return r ? te(
    e,
    t,
    xO,
    `${a}/${r}`
  ) : null;
}
function AO(e) {
  const t = Z(e.state).resolveInner(e.pos, -1);
  if (t.name === "BlockPrefix")
    return qe(e, t);
  if (t.prevSibling?.name === "BlockPrefix")
    return qe(e, t.prevSibling);
  if (t.name === "AttributeName")
    return ge(e, t);
  if (t.name === "DirectiveTarget")
    return ge(e, t.parent);
  if (t.name === "AttributeValueContent" || t.name === "UnquotedAttributeValue" || t.name === "Is") {
    const O = yO(
      e,
      t
    );
    if (O)
      return O;
    const n = WO(
      e,
      t
    );
    if (n)
      return n;
    const a = kO(
      e,
      t
    );
    if (a)
      return a;
  }
  return t.name === "TagName" && e.state.sliceDoc(t.from, t.to).startsWith("sve") || t.name === "SvelteElementType" ? QO(t) : null;
}
const BO = Se.map(({ snippet: e, test: t }, O) => ({
  option: V(e, {
    type: "keyword",
    boost: Se.length - O,
    label: e.includes("(") ? e.slice(0, e.indexOf("(")) : e
  }),
  test: t
}));
function EO(e) {
  const t = Z(e.state).resolveInner(e.pos, -1);
  if (t.name === "String" && t.parent?.name === "ImportDeclaration") {
    const O = [
      "svelte",
      "svelte/action",
      "svelte/animate",
      "svelte/attachments",
      "svelte/compiler",
      "svelte/easing",
      "svelte/events",
      "svelte/legacy",
      "svelte/motion",
      "svelte/reactivity",
      "svelte/reactivity/window",
      "svelte/server",
      "svelte/store",
      "svelte/transition"
    ];
    return {
      from: t.from + 1,
      options: O.map((n) => ({
        label: n,
        type: "string"
      }))
    };
  }
  if (t.name === "VariableName" || t.name === "PropertyName" || t.name === ".") {
    if ((t.name === "PropertyName" || t.name === ".") && t.parent?.name === "MemberExpression" && t.parent.firstChild?.name === "CallExpression" && t.parent.firstChild.firstChild?.name === "VariableName" && e.state.sliceDoc(
      t.parent.firstChild.firstChild.from,
      t.parent.firstChild.firstChild.to
    ) === "$inspect") {
      const n = e.matchBefore(/\.\w*/);
      return n ? {
        from: n.from,
        options: [
          V(".with(${})", {
            type: "keyword",
            label: ".with"
          })
        ]
      } : null;
    }
    const O = e.matchBefore(/\$[\w.]*/);
    return O ? {
      from: O.from,
      options: BO.filter((n) => n.test ? n.test(t, e) : !0).map((n) => n.option)
    } : null;
  }
  return null;
}
function YO(e) {
  let t = Z(e.state).resolveInner(e.pos, -1);
  for (; t && t.name !== "OpenTag" && t.name !== "SelfClosingTag"; )
    t = t.parent;
  const O = t?.getChild("SvelteElementName"), n = A(e, O);
  return n && /^svelte:(options|boundary)/.test(n) ? null : nt(e);
}
function ve(e) {
  const t = /^\s*<\//.test(e.textAfter);
  return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
}
const _O = De.add({
  Element: ve,
  Block: (e) => {
    const t = e.node, O = e.textAfter.trim(), n = t.name, a = n === "IfBlock" && O.startsWith("{/if") || n === "EachBlock" && O.startsWith("{/each") || n === "AwaitBlock" && O.startsWith("{/await") || n === "KeyBlock" && O.startsWith("{/key") || n === "SnippetBlock" && O.startsWith("{/snippet");
    return O.startsWith("{/") && a ? e.lineIndent(e.node.from) : O.startsWith("{/") && !a ? null : (n === "IfBlock" || n === "EachBlock") && O.startsWith("{:else") || n === "AwaitBlock" && O.startsWith("{:then") || n === "AwaitBlock" && O.startsWith("{:catch") ? e.lineIndent(e.node.from) : ve(e);
  },
  "BlockOpen BlockClose BlockInline OpenTag CloseTag SelfClosingTag": (e) => {
    const t = /^\s*\/?>/.test(e.textAfter);
    return e.column(e.node.from) + (t ? 0 : e.unit);
  },
  "Interpolation DirectlyInterpolatedAttribute": (e) => {
    const t = /^\s*}/.test(e.textAfter);
    return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
  }
});
function UO({ jsParser: e, tsParser: t, cssParser: O }) {
  return [
    {
      tag: "script",
      attributeMatcher: (n) => n.type === "text/typescript" || n.lang === "ts",
      parser: t ?? ze.parser
    },
    {
      tag: "script",
      attributeMatcher(n) {
        return !n.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(n.type);
      },
      parser: e ?? L.parser
    },
    {
      tag: "style",
      attributeMatcher(n) {
        return (!n.lang || n.lang === "css" || n.lang === "scss") && (!n.type || /^(text\/)?(x-)?(stylesheet|css|scss)$/i.test(n.type));
      },
      parser: O ?? He.parser
    }
  ];
}
function XO(e) {
  return Ge.define({
    parser: OO.configure({
      wrap: oO(UO(e)),
      props: [
        _O,
        Fe.add({
          Block: (t) => {
            const O = `${t.name}Open`, n = `${t.name}Close`, a = t.firstChild, r = t.lastChild;
            return a?.name !== O ? null : {
              from: a.to,
              to: r?.name === n ? r.from : t.to
            };
          },
          Element: (t) => {
            const O = t.firstChild, n = t.lastChild;
            return !O || !n || O.name !== "OpenTag" ? null : {
              from: O.to,
              to: n.name === "CloseTag" ? n.from : t.to
            };
          }
        })
      ]
    }),
    languageData: {
      commentTokens: { block: { open: "<!--", close: "-->" } },
      indentOnInput: /^\s*((<\/\w+\W)|(\/?>)|(\{:(else|then|catch))|(\{\/(if|each|await|key|snippet)))$/,
      wordChars: "-._",
      autocomplete: AO
    }
  });
}
function FO(e = {}) {
  const t = XO(e);
  return new Je(t, [
    et().support,
    L.data.of({
      autocomplete: EO
    }),
    Le().support,
    nO,
    t.data.of({
      autocomplete: YO
    })
  ]);
}
export {
  FO as svelte,
  XO as svelteLanguage,
  OO as svelteParser
};
