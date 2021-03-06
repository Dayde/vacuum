const classes = {
    TITAN: {
        name: 'Titan',
        value: 'TITAN',
        icon: 'https://bungie.net/common/destiny2_content/icons/8956751663b4394cd41076f93d2dd0d6.png'
    },
    HUNTER: {
        name: 'Hunter',
        value: 'HUNTER',
        icon: 'https://bungie.net/common/destiny2_content/icons/e7324e8c29c5314b8bce166ff167859d.png'
    },
    WARLOCK: {
        name: 'Warlock',
        value: 'WARLOCK',
        icon: 'https://bungie.net/common/destiny2_content/icons/bf7b2848d2f5fbebbf350d418b8ec148.png'
    }
};

Vue.component('class-type', {
    template: `
<div>
    <label v-for="clazz in classes" :title="clazz.name" v-tippy="{ followCursor: true, touchHold: true }" :for="clazz.name">
        <input :id="clazz.name" :name="clazz.name" type="radio" v-model="mutableClassType" :value="clazz.value">
        <img class="form-img" :src="clazz.icon" :alt="clazz.name">
    </label>
</div>
`,
    props: ['value'],
    data() {
        return {
            mutableClassType: this.value,
            classes: classes
        }
    },
    watch: {
        mutableClassType(newVal) {
            this.$emit('input', newVal);
        }
    }
});

const ClassType = {
    template: `
<div v-if="loading" class="loading"></div>
<class-type v-else v-model="classType" class="choose-class"></class-type>
`,
    data() {
        return {
            classType: null,
            loading: true
        }
    },
    mounted() {
        let userJSON = localStorage.getItem('user');
        if (userJSON && JSON.parse(localStorage.getItem('user')).userId === this.$route.params.userId) {
            let itemCategory = localStorage.getItem('itemCategory');
            let user = JSON.parse(localStorage.getItem('user'));
            if (itemCategory && user.userId === this.$route.params.userId) {
                this.$router.push({
                    path: `/sweep` +
                        `/${user.userId}` +
                        `/${user.platform}` +
                        `/${localStorage.getItem('classType')}` +
                        `/${itemCategory}`
                });
            }
        } else {
            this.loading = true;
            axios.get(`/api/users/${this.$route.params.userId}/${this.$route.params.platform}`)
                .then(response => {
                    let user = response.data;
                    let sortedCharaters = [];
                    for (let clazz in classes) {
                        for (let characterId in user.characters) {
                            let character = user.characters[characterId];
                            if (character.classType === clazz) {
                                sortedCharaters.push(character);
                                break;
                            }
                        }
                    }
                    user.characters = sortedCharaters;
                    localStorage.setItem('user', JSON.stringify(user));
                    this.loading = false;
                });
        }
    },
    watch: {
        classType(newVal) {
            let userId = this.$route.params.userId;
            let platform = this.$route.params.platform;
            this.$router.push({
                path: `/sweep/${userId}/${platform}/${newVal}/ARMOR`
            });
        }
    }
};
