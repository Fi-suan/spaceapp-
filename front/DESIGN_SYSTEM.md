# AI8 Digital Dashboard Design System

## General Principles
- Dark, navy-to-blue-black surfaces paired with light typography form the default palette.
- Structure data with cards and responsive grid layouts; avoid freeform positioning.
- Apply consistent color semantics: blue for active/primary, green for positive trends, red/orange for negative.
- Keep screens minimal and data-forward with generous spacing and clear grouping.
- Place export or upgrade actions (e.g., `Export Report`, `Upgrade Now`) prominently in the top right or fixed to the bottom of the sidebar.

## Typography
- **Headings:** Bold, 18-20px, white text.
- **Body:** Regular weight, 14-16px, light gray for readability on dark backgrounds.
- **Captions & Labels:** 12-14px, medium gray or gray-blue for secondary emphasis.
- Maintain tight hierarchies and avoid multi-line headlines where possible.

## Color & Visual Language
- Backgrounds: deep navy gradients; use subtle elevation changes instead of stark borders.
- Accent colors: blue for controls, green for gains, red/orange for declines, neutral gray-blue for inactive states.
- Shadows: soft, diffused shadows to lift cards off the background without high contrast edges.
- Icons: monotone, simplified silhouettes that remain legible at small sizes.

## Layout & Navigation
- Sidebar is always visible with sections: Dashboard, Reports, Prompts, Optimize, Insight (Intelligence, Sentiment, Citations).
- Reserve the bottom of the sidebar for the upgrade CTA (`Upgrade to Pro`).
- Present core metrics in the order: Visibility > Presence > Rank > Mentions.
- Use consistent spacing tokens so cards and grids align on both axes.

## Card Component
Cards present a single KPI with supporting context.

- **Structure:**
  - Top: small monotone icon indicating the metric category.
  - Middle: large numeric value or percentage with adjacent performance delta.
  - Bottom: concise descriptive label or time frame.
- **Performance Delta:** place next to the primary value; green for increases, red/orange for decreases.
- **Style:** dark background, 12-16px radius corners, subtle shadow, and internal padding that keeps content balanced.
- **Usage:** cards cover visibility, presence, rankings, mentions, and trend summaries.

## Graphs & Data Visualization
- Favor smooth line charts and progress bars to illustrate trends.
- Primary dataset uses blue; secondary comparison lines use green.
- Keep axes, tick marks, and labels minimal; only show critical values.
- Animate transitions gently to reinforce changes without distraction.

## Buttons
- **Primary Button:** filled blue background, white text, 8-10px radius; reserved for key actions such as `Export Report` or `Upgrade Now`.
- **Secondary Button:** neutral gray background with light text for supporting actions like `View Details`.
- Maintain clear contrast and spacing so buttons are easily scannable on dark surfaces.

## Status Indicators
- Positive trends pair a green arrow icon with the percentage change.
- Negative trends use a red arrow (or downward indicator) with orange/red percentage.
- Neutral states are gray/blue and omit arrow icons; display just the status value.

## Competitive Ranking
- Display rankings as a vertical list with rows for rank, competitor name, score, and delta.
- Emphasize the top position with a crown icon or higher contrast background.
- Ensure deltas follow the same color coding as other performance indicators.

## Prompt Lists
- Each prompt entry includes the prompt text, score (`xx/100`), mention count, and a trend tag (`trending`, `rising`, `stable`).
- Keep items concise and visually balanced; avoid wrapping metadata onto multiple lines when possible.

## Best Practices
- Opt for uniform iconography and succinct copy across all modules.
- Avoid text-heavy explanations; let metrics and visuals communicate state.
- Test dashboards for responsiveness so cards and charts adapt cleanly to different widths.
- Preserve accessibility by maintaining sufficient color contrast and providing textual trend cues alongside color.
