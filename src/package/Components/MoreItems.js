import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function Dropdown(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (index) => () => {
        props.items[index].action();
        setAnchorEl(null);
    }

    const isDisabled = (index) => {
        return props.items[index].disabled
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                className="dt_more_item_btn"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { width: '30ch' } }}
            >
                {props.items.map((option, index) => {
                    let disabled = isDisabled(index)
                    return (
                        <MenuItem disabled={disabled} key={index} onClick={handleAction(index)}>
                            <span className="mui_menu_item">
                                <span className="mui_menu_item_label">{option.label}</span>
                                <span className="mui_menu_item_icon">{option.icon}</span>
                            </span>

                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
}