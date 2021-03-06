require('dotenv').config()

module.exports = {
    purge: {
        enabled: process.env.NODE_ENV === 'DEVELOPMENT' ? false : true,
        content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        divideWidth: {
            DEFAULT: '3px',
            0: '0',
            2: '2px',
            3: '3px',
            4: '4px',
            6: '6px',
            8: '8px',
        },
        extend: {
            colors: {
                'regal-blue': '#101940',
            },
            backgroundImage: (theme) => ({
                image: "url('../Layout/Home/img/bg.png')",
                feather: "url('../Assets/Images/bgfeather1.jpg')",
            }),
            fontFamily: {
                openSans: ['OpenSans'],
                bebasNeue: ['BebasNeue'],
            },
            spacing: {
                120: '29rem',
                128: '32rem',
                144: '36rem',
                192: '48rem',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
}
