## Tree manager

### Purpose:

#### create custom node react trees
> for React based renderers, when instead of "dom" node it's all custom tree elements

### Building blocks:

* Tree node: base item with props to extend: add/remove children + logging
> has inner state to hold children and node "name", no "props" notion yet here
* Lifecycle node: adds mount - update - destroy methods
> provides options for the next layer to extend, mount and "props" update is already handled
* Input node: a base for a tree data flow (aka browser): bubble and capture
> each event bubble "up" the tree, and can be "captured" on it's way down


### Examples
> see "./example" folder

#### the story
> Render services, modules, plugins with react and jsx, data flow included

* pluginOne depends on
    * serviceOne
    * serviceTwo

* pluginTwo depends on
    * serviceTwo

* serviceOne belongs to moduleOne and depends on
    * serviceThree

* service Two belongs to moduleTwo and depends on
    * serviceOne

* service Three belongs to moduleTwo and depends on
    * nothing (is point free)

##### pluginTwo load sequence:
1. serviceThree
2. serviceOne
3. serviceTwo

### To read:
* https://github.com/harimohan1990/The-Reconciliation-Algorithm-in-React
* https://medium.com/@azizhk/building-an-async-react-renderer-with-diffing-in-web-worker-f3be07f16d90
* https://deepwiki.com/facebook/react/3-rendering-targets
