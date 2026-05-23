import { el, mkSection, mkSublabel } from "./utils.js";

function cls(base, mod) {
  return mod ? `${base} ${mod}` : base;
}

function mkCode(text) {
  const pre = el("pre", "code-block");
  const code = el("code");
  code.textContent = text.trim();
  pre.append(code);
  return pre;
}

function mkDetails(summaryText, bodyText, open = false) {
  const dt = el("details");
  if (open) dt.open = true;
  const sm = el("summary");
  sm.textContent = summaryText;
  const p = el("p");
  p.textContent = bodyText;
  dt.append(sm, p);
  return dt;
}

const BUTTON_STATES = [
  { label: "default", mod: "", isDisabled: false },
  { label: "hover", mod: "is-hover", isDisabled: false },
  { label: "focus", mod: "is-focus", isDisabled: false },
  { label: "active", mod: "is-active", isDisabled: false },
  { label: "disabled", mod: "is-disabled", isDisabled: true },
];

const INPUT_STATES = [
  { label: "default", mod: "", isDisabled: false },
  { label: "hover", mod: "is-hover", isDisabled: false },
  { label: "focus / active", mod: "is-focus", isDisabled: false },
  { label: "disabled", mod: "is-disabled", isDisabled: true },
];

function mkStatesTable(headers, states, mkCells, tableClass = "demo-grid") {
  const table = el("table", tableClass);

  const thead = el("thead");
  const headerRow = el("tr");
  ["", ...headers].forEach((h) => {
    const th = el("th", "demo-header");
    th.textContent = h;
    headerRow.append(th);
  });
  thead.append(headerRow);
  table.append(thead);

  const tbody = el("tbody");
  const mkCell = (child) => {
    const td = el("td", "demo-cell");
    td.append(child);
    return td;
  };

  states.forEach(({ label, mod, isDisabled }) => {
    const row = el("tr");

    const stateLabel = el("span", "demo-state");
    stateLabel.textContent = label;
    row.append(mkCell(stateLabel));

    mkCells(mod, isDisabled).forEach((child) => row.append(mkCell(child)));

    tbody.append(row);
  });
  table.append(tbody);

  return table;
}

function renderButtonStates() {
  return mkStatesTable(
    ["Primary", "Secondary", "Tertiary", "Destructive", "Link"],
    BUTTON_STATES,
    (mod, isDisabled) => {
      const btnP = el("button", cls("primary", mod));
      btnP.textContent = "Button";
      if (isDisabled) btnP.disabled = true;

      const btnS = el("button", cls("secondary", mod));
      btnS.textContent = "Button";
      if (isDisabled) btnS.disabled = true;

      const btnT = el("button", cls("tertiary", mod));
      btnT.textContent = "Button";
      if (isDisabled) btnT.disabled = true;

      const btnD = el("button", cls("destructive", mod));
      btnD.textContent = "Button";
      if (isDisabled) btnD.disabled = true;

      const link = el("a", cls("demo-link", mod));
      link.textContent = "Link text";
      if (isDisabled) link.setAttribute("aria-disabled", "true");
      else link.href = "#";

      return [btnP, btnS, btnT, btnD, link];
    },
  );
}

function mkCheckPair(type, mod, isDisabled) {
  const wrap = el("div", "check-pair");
  [false, true].forEach((checked) => {
    const input = el("input", mod);
    input.type = type;
    if (checked) input.checked = true;
    if (isDisabled) input.disabled = true;
    if (type === "checkbox") {
      const label = el("label");
      label.append(input);
      wrap.append(label);
    } else {
      wrap.append(input);
    }
  });
  return wrap;
}

function renderInputStates() {
  return mkStatesTable(
    ["Input", "Select", "Checkbox", "Radio"],
    INPUT_STATES,
    (mod, isDisabled) => {
      const hasValue = mod === "is-focus";

      const input = el("input", mod);
      input.type = "text";
      input.placeholder = "Placeholder";
      if (isDisabled) input.disabled = true;
      if (hasValue) input.value = "Input value";

      const select = el("select", mod);
      if (isDisabled) select.disabled = true;
      ["Option 1", "Option 2", "Option 3"].forEach((label, i) => {
        const opt = el("option");
        opt.value = `option-${i + 1}`;
        opt.textContent = label;
        select.append(opt);
      });

      return [
        input,
        select,
        mkCheckPair("checkbox", mod, isDisabled),
        mkCheckPair("radio", mod, isDisabled),
      ];
    },
    "demo-grid demo-grid--inputs",
  );
}

export function renderStates() {
  const sec = mkSection("States");
  sec.append(mkSublabel("Buttons"));
  sec.append(renderButtonStates());
  sec.append(mkSublabel("Inputs"));
  sec.append(renderInputStates());
  return sec;
}

export function renderLabelField() {
  const sec = mkSection("Label / Input");
  const structTable = el("div", "struct-table");

  const ex1Wrap = el("div", "label-input-pair");
  const ex1Label = el("label");
  ex1Label.setAttribute("for", "demo-external-input");
  ex1Label.textContent = "Label";
  const ex1Input = el("input");
  ex1Input.type = "text";
  ex1Input.id = "demo-external-input";
  ex1Input.placeholder = "Input target";
  ex1Wrap.append(ex1Label, ex1Input);
  const r1Demo = el("div", "struct-cell-demo");
  r1Demo.append(ex1Wrap);
  const r1Code = el("div", "struct-cell-code");
  r1Code.append(
    mkCode(`<label for="input">Label</label>
<input id="input" type="text" placeholder="Input target" />`),
  );
  structTable.append(r1Demo, r1Code);

  const fieldLabel = el("label", "field");
  const fieldSpan = el("span");
  fieldSpan.textContent = "Label";
  const fieldInput = el("input");
  fieldInput.type = "text";
  fieldInput.placeholder = "Input target";
  fieldLabel.append(fieldSpan, fieldInput);
  const r2Demo = el("div", "struct-cell-demo");
  r2Demo.append(fieldLabel);
  const r2Code = el("div", "struct-cell-code");
  r2Code.append(
    mkCode(`<label class="field">
  <span>Label</span>
  <input type="text" placeholder="Input target" />
</label>`),
  );
  structTable.append(r2Demo, r2Code);

  sec.append(structTable);
  return sec;
}

export function renderFieldsetLegend() {
  const sec = mkSection("Fieldset / Legend");
  const fsEl = el("fieldset");
  const lgEl = el("legend");
  lgEl.textContent = "Legend";
  const lb = el("p");
  lb.textContent = "Fieldset child";
  fsEl.append(lgEl, lb);
  sec.append(fsEl);
  return sec;
}

export function renderDetailsSummary() {
  const sec = mkSection("Details / Summary");
  sec.append(
    mkDetails("Collapsed", "Hidden content visible on expand."),
    mkDetails("Expanded", "Visible content when details is open.", true),
  );
  return sec;
}
