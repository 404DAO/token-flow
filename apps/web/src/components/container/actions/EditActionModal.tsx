import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select } from '@mui/material';
import { ActionBaseModel, ActionType } from 'internal-common';
import { SandboxFlowContext } from '../../../hooks/sandbox-flow-store';
import AlertActionEdit from './AlertActionEdit';
import MoneyActionEdit from './MoneyActionEdit';


interface EditActionModalProps {
  showEditModal: boolean,
  setShowEditModal: (flag: boolean) => void,
  actionIndex?: number
}

export function hasActionType(actionTypeTargate: ActionType, allActions: ActionBaseModel[]): boolean {
  return allActions.some((action) => action.actionType === actionTypeTargate);
}

const EditActionModal = function ({ showEditModal, setShowEditModal, actionIndex }: EditActionModalProps) {
  const [sandboxFlowData, sandboxFlowDataDispatch] = React.useContext(SandboxFlowContext);
  const [action, setAction] = React.useState<ActionBaseModel | undefined>(actionIndex === undefined 
    ? undefined
    : sandboxFlowData.actions[actionIndex]);

  React.useEffect(() => {
    if (actionIndex === undefined) {
      setAction(undefined);
    } else {
      setAction(sandboxFlowData.actions[actionIndex]);
    }
  }, [actionIndex, sandboxFlowData.actions]);

  return <Dialog
    // className='w-96'
    open={showEditModal}
    fullWidth
    onClose={() => setShowEditModal(false)}
    aria-labelledby='edit-modal'
    aria-describedby="modal-description"
  >
    <DialogTitle id="alert-dialog-title">
      What to do when conditions above are met
    </DialogTitle>
    <DialogContent className='h-80'>
      <FormControl>
        <Select
          className='w-80'
          variant="standard"
          labelId="action-type-select"
          id="action-type-select"
          value={action?.actionType || 'DEFAULT'}
          defaultValue="DEFAULT"
          label="Action type"

          onChange={(event) => {
            if (event.target.value !== 'DEFAULT') {
              setAction({
                actionType: event.target.value as ActionType,
              });
            }
          }
        } >
          <MenuItem value="DEFAULT" disabled> </MenuItem>
          <MenuItem value={ActionType.ALERT_ACTION} disabled={
            hasActionType(
              ActionType.ALERT_ACTION,
              sandboxFlowData.actions
            )
            && action?.actionType !== ActionType.ALERT_ACTION
          }>
            Send alerts / notifications
          </MenuItem>
          {<MenuItem value={ActionType.MONEY_ACTION} disabled={
            hasActionType(
              ActionType.MONEY_ACTION,
              sandboxFlowData.actions
            ) && action?.actionType !== ActionType.MONEY_ACTION
          }>
            Transfer / Swap / Yield Deposit
          </MenuItem>}
        </Select>

        {action?.actionType === ActionType.ALERT_ACTION && <AlertActionEdit />}
        {action?.actionType === ActionType.MONEY_ACTION && <MoneyActionEdit />}
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          if (action) {
            setShowEditModal(false);
            if (actionIndex !== undefined) {
              sandboxFlowDataDispatch({
                type: 'EDIT_ACTION',
                payload: action,
                index: actionIndex
              });
            } else {
              sandboxFlowDataDispatch({
                type: 'ADD_ACTION',
                payload: action
              });
            }
            
          }
        }}
        autoFocus
      >
        Looks good!
      </Button>
    </DialogActions>
  </Dialog>;
};

export default EditActionModal;
