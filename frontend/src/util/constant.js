export const openBig = () => {
    document.querySelector(".bigNoteRef").classList.add('back_active')
}

export const closeBig = () => {
    document.querySelector(".bigNoteRef").classList.remove('back_active')
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

