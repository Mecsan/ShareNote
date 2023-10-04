import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, themes } from '../redux/slices/themSlice';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function ThemeBtn() {
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    let isDark = theme == themes.DARK;

    let changeDark = () => {
        dispatch(changeTheme(isDark ? themes.LIGHT : themes.DARK));
    }

    return (
        <div className='theme-btn' onClick={changeDark}>
            {
                isDark ? <DarkModeIcon style={{
                    color: "white"
                }} /> : <LightModeIcon />
            }
        </div>
    )
}

export default ThemeBtn