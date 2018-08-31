Modal Components
=================================

These are presentational components for creating modals.

### ModalFadeBox: 

A presentational component which is styled to fade the rest of the screen at 0.5 opacity.
 
### ModalContainer: 

A presentational component which contains the contents of the modal.

### Modal: 

A presentational component which contains ModalFadeBox and ModalContainer.

## Example: 

```jsx
<Modal onClose={onClose} className="example-modal-container">
  Sample Content
</Modal>
```
