export const state = () => ({
    loadedData: [],
    genre: [],
    user: null,
})


export const mutations = {
    SET_DATA(state, payload) {
        state.loadedData = payload;
    },
    SET_GENRE(state, id) {
        state.genre = state.loadedData.find(el => el.id === id)
    },
    SET_USER(state, user) {
        state.user = user;
    }
};


export const actions = {
    async nuxtServerInit({ commit }, context) {
        await this.$axios.get(process.env.baseUrl + 'data')
            .then(response => {
                const mapped = response.data.map((el) => {
                    return {
                        ...el,
                        id: +el.id,
                    }
                })
                commit('SET_DATA', mapped);
            })
            .catch(e => context.error(e));
    },
};


export const getters = {
    songsArr(state) {
        return state.genre.data;
    },
    getGenre(state) {
        return state.genre.genre;
    },
};

