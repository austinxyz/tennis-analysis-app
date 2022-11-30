/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    content: [
        './node_modules/@bitthecat/tailwind-vue-data-table/dist/*.js',
    ],
    plugins: [],
}
