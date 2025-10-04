# SpaceApp Design System Guidelines

## General Guidelines

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files

## Design System Guidelines

* Use a base font-size of 14px
* Date formats should always be in the format "Jun 10"
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

## Button Component

The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices, or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* **Primary Button**
  * Purpose: Used for the main action in a section or page
  * Visual Style: Bold, filled with the primary brand color
  * Usage: One primary button per section to guide users toward the most important action
* **Secondary Button**
  * Purpose: Used for alternative or supporting actions
  * Visual Style: Outlined with the primary color, transparent background
  * Usage: Can appear alongside a primary button for less important actions
* **Tertiary Button**
  * Purpose: Used for the least important actions
  * Visual Style: Text-only with no border, using primary color
  * Usage: For actions that should be available but not emphasized

## Space Theme Guidelines

* Use dark backgrounds with space-themed gradients
* Implement glass-morphism effects for cards and components
* Use blue and purple accent colors for space elements
* Include subtle animations for stars and cosmic elements
* Maintain high contrast for accessibility
* Use space-related icons and imagery
