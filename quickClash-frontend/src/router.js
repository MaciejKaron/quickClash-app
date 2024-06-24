import { createWebHistory, createRouter } from "vue-router";
// import Home from "./components/Home.vue";
// import Login from "./components/Login.vue";
// import Register from "./components/Register.vue";
// lazy-loaded
const Login = () => import("./views/Login.vue")
const Register = () => import("./views/Register.vue")
const Home = () => import("./views/Home.vue")
const Profile = () => import("./views/Profile.vue")
const BoardAdmin = () => import("./views/BoardAdmin.vue")
const BoardModerator = () => import("./components/BoardModerator.vue")
const BoardUser = () => import("./components/BoardUser.vue")
const TournamentEdit = () => import("./views/TournamentEdit.vue")
const Premium = () => import("./views/Premium.vue")
const Friends = () => import("./views/Friends.vue")
const UserProfile = () => import("./views/UserProfile")
const Team = () => import("./views/Team")
const myTeam = () => import("./views/myTeam")
const TeamProfile = () => import("./views/TeamProfile")
const Ranking = () => import("./views/Ranking")
const PremiumSuccess = () => import("./views/PremiumSuccess")
const TournamentInfo = () => import("./views/TournamentInfo")
const TournamentInfo5v5 = () => import("./views/TournamentInfo5v5")

const routes = [
    {
        path: "/",
        name: "start",
        component: Login,
    },
    {
        path: "/home",
        component: Home,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/profile",
        name: "profile",
        //lazy-loaded
        component: Profile,
    },
    {
        path: "/admin",
        name: "admin",
        // lazy-loaded
        component: BoardAdmin,
      },
      {
        path: "/mod",
        name: "moderator",
        // lazy-loaded
        component: BoardModerator,
      },
      {
        path: "/user",
        name: "user",
        // lazy-loaded
        component: BoardUser,
    },
    {
        path: "/tournament/edit/:id",
        name: "tournamentEdit",
        // lazy-loaded
        component: TournamentEdit,
    },
    {
        path: "/premium",
        name: "premium",
        // lazy-loaded
        component: Premium,
    },
    {
        path: "/friends",
        name: "friends",
        //lazy-loaded
        component: Friends,
    },
    {
        path: "/user/profile/:id",
        name: "UserProfile",
        //lazy- loaded
        component: UserProfile,
    },
    {
        path: "/team",
        name: "team",
        //lazy-loaded
        component: Team,
    },
    {
        path: "/myTeam/:id",
        name: "myTeam",
        //lazy-loaded
        component: myTeam,
    },
    {
        path: "/team/profile/:id",
        name: "TeamProfile",
        //lazy-loaded
        component: TeamProfile
    },
    {
        path: "/ranking",
        name: "ranking",
        //lazy-loaded
        component: Ranking,
    },

    {
        path: "/premium/success",
        name: "success",
        //lazy-loaded
        component: PremiumSuccess,
    },

    {
        path: "/tournament/info/:id",
        name: "tournamentInfo",
        // lazy-loaded
        component: TournamentInfo,
    },

    {
        path: "/tournament/info5v5/:id",
        name: "tournamentInfo5v5",
        // lazy-loaded
        component: TournamentInfo5v5,
    },
      
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

//CHECK AUTHORIZED STATUS EVERYTIME A NAVIGATING ACTION IS TRIGGERED

// router.beforeEach((to, from, next) => {
//     const publicPages = ['/login', '/register', '/home'];
//     const authRequired = !publicPages.includes(to.path);
//     const loggedIn = localStorage.getItem('user');
//     // trying to access a restricted page + not logged in
//     // redirect to login page
//     if (authRequired && !loggedIn) {
//       next('/login');
//     } else {
//       next();
//     }
//   });

export default router;