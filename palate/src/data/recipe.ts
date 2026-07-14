import type { Recipe } from "../types/recipe";


export const recipes: Recipe[] = [

{
    id:"1",

    name:"Chicken Teriyaki Bowl",

    cuisine:"Japanese",

    mealType:"Dinner",

    difficulty:"Easy",

    cookTime:30,

    description:
    "A simple Japanese inspired chicken rice bowl.",

    ingredients:[
        "Chicken",
        "Rice",
        "Soy Sauce",
        "Ginger"
    ],

    instructions:[
        "Prepare rice",
        "Mix teriyaki sauce",
        "Cook chicken",
        "Combine and serve"
    ]
},


{
    id:"2",

    name:"Creamy Garlic Pasta",

    cuisine:"Italian",

    mealType:"Dinner",

    difficulty:"Medium",

    cookTime:25,

    description:
    "Comfort pasta with creamy garlic sauce.",

    ingredients:[
        "Pasta",
        "Garlic",
        "Cream",
        "Parmesan"
    ],

    instructions:[
        "Boil pasta",
        "Prepare sauce",
        "Mix together"
    ]
},


{
    id:"3",

    name:"Chicken Burrito Bowl",

    cuisine:"Mexican",

    mealType:"Lunch",

    difficulty:"Easy",

    cookTime:20,

    description:
    "Healthy high protein burrito bowl.",

    ingredients:[
        "Chicken",
        "Rice",
        "Beans",
        "Avocado"
    ],

    instructions:[
        "Cook chicken",
        "Prepare toppings",
        "Assemble bowl"
    ]
}

];