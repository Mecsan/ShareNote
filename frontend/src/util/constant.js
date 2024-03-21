export const openModal = () => {
    document.querySelector(".bigNoteRef").classList.add('back_active')
}

export const closeModal= () => {
    document.querySelector(".bigNoteRef").classList.remove('back_active');
}

export const debounceDelay = 5000;

export const styles = {
    light: {
        "btn": "black",
        "btn-primary": '#5469d4',
    },
    dark: {
        "btn-primary": "#5469d4",
        "btn": "white",
        "btn-danger": "red"
    }
}

export let toastConfig = {
    position: "top-right",
    lightToast: {
        boxShadow: "0px 0px 15px #333"
    },
    darkToast: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
    }
}

