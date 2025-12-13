import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useState } from "react";
import { useRoles } from "../../../../../hooks/use-roles";
import {
  useApproveConstraint,
  useDeleteConstraint,
  useRejectConstraint,
} from "../../../../../mutations/constraint";
import { Constraint } from "../../../../../shared/types/entities/constraint";
import CreateConstraintDialog from "../../create-constraint-dialog";
import style from "./style.module.css";
import { useTrack } from "../../../../../hooks/use-track";

interface Props {
  constraint: Constraint;
}

const ActionsMenu = ({ constraint }: Props) => {
  const { trackEvent } = useTrack();
  const { mutateAsync: deleteConstraint } = useDeleteConstraint();
  const { mutateAsync: approveConstraint } = useApproveConstraint();
  const { mutateAsync: rejectConstraint } = useRejectConstraint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole, hasRoleOrOwnership } = useRoles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    trackEvent("constraints", "open_menu");
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    trackEvent("constraints", "delete", {
      id: constraint.id,
      type: constraint.type,
      date: constraint.date,
      prevStatus: constraint.status,
      shiftType: constraint.shiftType,
      userId: constraint.user.id,
    });

    if (window.confirm("האם אתה בטוח שברצונך למחוק אילוץ זה?")) {
      await deleteConstraint(constraint.id);
    }
    handleCloseMenu();
  };

  const handleEdit = async () => {
    trackEvent("constraints", "open_edit_modal", {
      id: constraint.id,
      type: constraint.type,
      date: constraint.date,
      prevStatus: constraint.status,
      shiftType: constraint.shiftType,
      userId: constraint.user.id,
    });
    setIsModalOpen(true);
    handleCloseMenu();
  };

  const handleApprove = async () => {
    trackEvent("constraints", "approve", {
      id: constraint.id,
      type: constraint.type,
      date: constraint.date,
      prevStatus: constraint.status,
      shiftType: constraint.shiftType,
      userId: constraint.user.id,
    });
    await approveConstraint(constraint.id);
    handleCloseMenu();
  };

  const handleReject = async () => {
    trackEvent("constraints", "reject", {
      id: constraint.id,
      type: constraint.type,
      date: constraint.date,
      prevStatus: constraint.status,
      shiftType: constraint.shiftType,
      userId: constraint.user.id,
    });
    await rejectConstraint(constraint.id);
    handleCloseMenu();
  };

  return (
    <div>
      {
        isModalOpen && (
          <CreateConstraintDialog
            open={isModalOpen}
            onClose={handleCloseModal}
            constraint={constraint}
          />
        )
      }

      <IconButton onClick={handleClick}>
        <MoreVertIcon titleAccess="תפריט" fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        className={style.menu}
      >
        {
          (hasRoleOrOwnership(["TEAM_LEADER", "SHIFTS_ADMIN"], constraint.user.id)) &&
          <div>
            <MenuItem onClick={handleEdit} disableRipple>
              <EditIcon className={style.icon} />
              עריכה
            </MenuItem>
            <MenuItem onClick={handleDelete} disableRipple>
              <DeleteIcon className={style.icon} />
              מחיקה
            </MenuItem>
          </div>
        }

        {
          hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) && <Divider />
        }

        {
          hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) &&
          <div>
            <MenuItem onClick={handleApprove} disableRipple>
              <CheckCircleOutlineIcon className={style.icon} />
              אישור אילוץ
            </MenuItem>
            <MenuItem onClick={handleReject} disableRipple>
              <HighlightOffIcon className={style.icon} />
              דחיית אילוץ
            </MenuItem>
          </div>
        }
      </Menu>
    </div>
  );
};

export default ActionsMenu;
