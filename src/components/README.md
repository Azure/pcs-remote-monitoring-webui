Components
==========
The components folder contains all of the React components. These components
are organized into the following structure.

- `App`: Contains the main React app component and any sub components used only
by the App. Contains both presentational components and any containers.
- `Pages`: Pages contains all the components related to individual pages of the
application. Contains both presentational components and any containers.
- `Shared`: The shared folder contains presentational components used across the
app.

One-off components that are used only be a specific view or page should nested
within the folder of the component that requires it. As components are needed
across components, they should be pushed down the hierarchy moved to the shared
folder.

Containers should only encapsulate non-container components. They should have
associated templates or css.
