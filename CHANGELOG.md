# Release v0.5.0

- added `onCellClick` callback, fired when clicking an empty cell of a resource row
- added `onCellRangeSelect` callback, fired when dragging a selection across several cells of the same resource row (the range can be dragged in either direction)
- added `selectedCell` prop to highlight a cell or a range of cells on the grid
- added tile drag & drop with the `onTileMove` callback, which gives the new resource and dates of the moved tile (the original duration is kept)
- added a ghost preview of the drop location while dragging a tile
- added `draggable` property on resource items to disable dragging for specific tiles (defaults to `true`)
- added `style` property on resource items to apply custom inline styles to a tile (e.g. `backgroundImage`)
- added a slide transition when navigating to the previous / next period
- exported `CellClickData`, `CellRangeSelectData`, `SelectedRange` and `TileMoveData` types
- fixed styled-components style props leaking to the DOM by using transient (`$`-prefixed) props

# Release v0.4.1

- fixed weeks being wrongly placed on the grid

# Release v0.4.0

- package forked and published as `@code-rhapsodie/react-scheduler`
- added `fr`, `es`, `he`, `it`, `pt-BR` and `ro` translations
- upgraded to React 19, styled-components 6, TypeScript 7 and Vite 8
- migrated ESLint to the flat config format

# Release v0.3.1

- aligned tile text to the left

# Release v0.3.0

- added hourly view (`zoom: 2`)
- added dark mode with `showThemeToggle` and `defaultTheme` config properties
- added custom theme configuration
- centered the empty box message
- fixed type definitions
- upgraded React to 18.3.1

# Release v0.2.1

- added example of scheduler data filtering in readme.md
- added `lt` language
- improved scrolling and fixed current date column offset
- fixed tile placement when a project starts and ends before / after an existing project in the same row

# Release v0.2

- added `showTooltip` property to scheduler's config object for showing / hiding tooltip when hovering over the tiles
- added `translations` property to scheduler's config object which allow user to add a custom translations
