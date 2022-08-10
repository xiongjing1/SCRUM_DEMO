function newPage (id , name, height, width) {
    return {
        id: id,
        name: name,
        width: width || '100%',
        height: height || '100%',
        styles: {
            '--mdc-theme-primary': '#673ab7',
            '--mdc-theme-secondary': '#f44336',
            '--mdc-theme-background': '#ffffff',
            'position': 'relative',
            'margin': 'auto',
            'background-color': '#ffffff',
            'overflow': 'hidden'
        },
        classes: [],
        children: []
    }
}

export default newPage