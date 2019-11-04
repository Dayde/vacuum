const energies = {
    SOLAR: {
        name: 'Solar',
        value: 'SOLAR',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png'
    },
    VOID: {
        name: 'Void',
        value: 'VOID',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png'
    },
    ARC: {
        name: 'Arc',
        value: 'ARC',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_9fbcfcef99f4e8a40d8762ccb556fcd4.png'
    }
};

const stats = {
    MOBILITY: {
        name: 'Mobility',
        value: 'MOBILITY',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/c9aa8439fc71c9ee336ba713535569ad.png'
    },
    RESILIENCE: {
        name: 'Resilience',
        value: 'RESILIENCE',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/9f5f65d08b24defb660cebdfd7bae727.png'
    },
    RECOVERY: {
        name: 'Recovery',
        value: 'RECOVERY',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/47e16a27c8387243dcf9b5d94e26ccc4.png'
    },
    DISCIPLINE: {
        name: 'Discipline',
        value: 'DISCIPLINE',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/ca62128071dc254fe75891211b98b237.png'
    },
    INTELLECT: {
        name: 'Intellect',
        value: 'INTELLECT',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/59732534ce7060dba681d1ba84c055a6.png'
    },
    STRENGTH: {
        name: 'Strength',
        value: 'STRENGTH',
        icon: 'https://www.bungie.net/common/destiny2_content/icons/c7eefc8abbaa586eeab79e962a79d6ad.png'
    },
};

Vue.component('item', {
    template: `
<div class="item-container">
    <div class="item-image clickable"
         v-tippy="{ html: '#item' + item.instanceId, trigger: 'click', interactive: true, reactive: true, hideOnClick: true }">
        <img :src="'https://www.bungie.net' + item.icon" :alt="item.name"/>
        <img v-if="item.masterwork" src="/masterwork.png" alt="masterwork" :class="{ masterwork: item.masterwork }" />
        <span class="top-right">
            {{item.powerLevel}}
        </span>
    </div>
    <div class="item-details">
        <span class="item-energy">
            <img :src="energyType(item.energyType).icon"
                 class="stat-icon"/>
            &nbsp;&nbsp;{{ item.energy }}
        </span>
        <div class="item-stats" v-if="item.totalStats != 0">
            <span v-for="(stat, statName) in stats">
                <img :src="stats[statName].icon"
                     class="stat-icon"/>
                {{ ( item.stats[statName] < 10 ? '&nbsp;&nbsp;' : '' ) + item.stats[statName] }}
            </span>
            <span>{{ item.totalStats }}</span>
        </div>
    </div>
    <div :id="'item' + item.instanceId">
        <div>{{ item.name }}</div>
        <img  v-for="character in characters" class="location clickable"
              :class="{current: item.location === character.characterId}" 
              :src="classType(character.classType).icon" :alt="classType(character.classType).name"
              @click="transferItem(character.characterId)"/>
        <img src="https://bungie.net/common/destiny2_content/icons/42284fb3e73118f37cc7563c6ae70097.png" alt="Vault"
             class="location clickable" :class="{current: item.location === ''}" @click="transferItem('')"/>
    </div>
</div>
`,
    props: {
        item: Object
    },
    data() {
        let user = JSON.parse(localStorage.getItem('user'));
        return {
            characters: user.characters,
            classes: classes,
            energies: energies,
            stats: stats
        };
    },
    methods: {
        classType(classType) {
            return this.classes[classType];
        },
        energyType(energyType) {
            return this.energies[energyType];
        },
        transferItem(characterId) {
            let user = JSON.parse(localStorage.getItem('user'));
            axios.put(
                `/api/users/${user.userId}/${user.platform}/items/${this.item.itemHash}/${this.item.instanceId}`,
                {},
                {
                    params: {
                        currentLocation: this.item.location,
                        targetLocation: characterId
                    }
                }
            ).then(response => this.item.location = characterId);
        }
    }
});
