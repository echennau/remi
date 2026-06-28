import { mkTopSection } from "./components/utils.js";
import { renderColorScales, renderColorReference } from "./components/color.js";
import { renderTypography } from "./components/typography.js";
import { renderSpacing } from "./components/spacing.js";
import { renderRadius } from "./components/radius.js";
import { renderShadows } from "./components/shadows.js";
import { renderMotion } from "./components/motion.js";
import {
  renderStates,
  renderLabelField,
  renderFieldsetLegend,
  renderDetailsSummary,
  renderMark,
} from "./components/components.js";
import tokens from "@tokens";

function render(t) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const theme = mkTopSection("Theme");
  theme.id = "theme";
  theme.append(
    renderColorScales(t.color),
    renderSpacing(t.spacing),
    renderRadius(t.radius),
    renderShadows(t.shadow),
    renderMotion(t.duration),
  );

  const typo = mkTopSection("Typography");
  typo.id = "typography";
  typo.append(renderTypography(t.typography));

  const comp = mkTopSection("Components");
  comp.id = "components";
  comp.append(
    renderColorReference(t.color),
    renderStates(),
    renderLabelField(),
    renderFieldsetLegend(),
    renderDetailsSummary(),
    renderMark(),
  );

  app.append(theme, typo, comp);
}

render(tokens);
