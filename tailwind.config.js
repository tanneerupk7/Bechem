
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      screens: {
        'c-sm' : '640px',
        'c-md' : '768px',
        'c-lg' : '1024px',
        'c-xl' : '1280px',
        'c-2xl': '1536px',
      },
      fontWeight: {
        "heading":'14px',
        "content":"11px"
      },
      colors:{
        'customYellow':"#FBB900",
        'hoverBlue':"#13DAFD",
        'navbarColor':"#E6E6E6CC",
        'navbarFontColor':"#64748B",
        'tableHeaderColor':"#969696",
        'exportButtonColor':"#CBCBCB",
        'paginationColor':"#F1F5F9",
        'poListPONumberColor':"#015397",
        'greeenButtonColor':"#15460B",
      },
    },
    
  },
  plugins: [],
}

