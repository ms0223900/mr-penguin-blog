import { SinglePost } from 'common-types';

const nuxt3Pinia: SinglePost = {
  uid: 1,
  id: 'nuxt3-pinia',
  title: 'Nuxt3 + Pinia實戰教學',
  thumbnail: {
    src: 'https://pinia.vuejs.org/logo.svg',
  },
  description:
    'Pinia是近期熱門的輕量化函式庫，用於替代vuex的"全域資料管理的函式庫，適合低複雜度的中小型專案',
  subTitle: 'Nuxt3配鳳梨吃，更好吃 🍍',
  createdAt: '2022-02-22',
  content: `
  ![pinia say hi](https://imgur.com/d6uBDkM.jpg)
  ## 前言
  
  Nuxt3雖有原生支援store，vue本身也有provide和inject可以用，但從原本的專案(vue3 + vuex)搬到Nuxt3，還是想直接用vuex無痛升級。
  
  但是，很不幸的，vuex在nuxt3不管怎樣就是裝不起來(如果有大大裝的起來，還請不吝指教)，爬文爬了許久，終於找到了Pinia這個可愛的鳳梨。
  
  Pinia是近期熱門的輕量化函式庫，用於替代vuex的"全域資料管理的函式庫，適合用於中小型專案，特色是
  
  - 沒有mutations，直接用actions改變state
  - 原生支援typescript
  - 完美支援Nuxt3 ← 最重要的一點
  
  ## 前置作業
  
  ### nuxt3
  
  \`\`\`bash
  npx nuxi init {專案名稱} //初始化專案
  cd {專案名稱} // 移動到該資料夾
  yarn install //
  \`\`\`
  
  ### Pinia
  
  安裝pinia
  
  分別安裝: pinia, @pinia/nuxt, @nuxtjs/composition-api 這三個套件
  
  \`\`\`bash
  yarn add pinia @pinia/nuxt @nuxtjs/composition-api
  \`\`\`
  
  設定nuxt.config.js
  
  \`\`\`bash
  export default {
    // ... other options
    buildModules: [
      '@pinia/nuxt',
    ],
  }
  \`\`\`
  
  上面的都裝好之後，就可以準備開發囉!
  
  \`\`\`tsx
  yarn dev -o
  \`\`\`
  
  ## Pinia基本介紹
  
  ### 基本架構
  
  store/index.ts
  
  \`\`\`tsx
  import { defineStore, _ActionsTree, _GettersTree } from "pinia";
  
  // 將其命名為useXXXStore，就像vue3的composable一樣
  const useStore = defineStore("main", {
    state : () => ({}),
    actions: {},
    getters: {},
  });
  
  export default useStore;
  \`\`\`
  
  ### state
  
  就是單純的state，要以function形式return資料，就像是vue的data() {}一樣
  
  \`\`\`tsx
  //...
  export interface State {
    count: number
  }
  
  // 建議以initState先聲明在useStore之前，這樣比較好用，尤其是reset的情況特別好用
  const initState: State = {
    count: 0,
  }
  
  const useStore = defineStore("main", {
    state : () => initState,
  });
  \`\`\`
  
  ### getters
  
  \`\`\`tsx
  import { defineStore, _GettersTree } from "pinia";
  
  // 提前宣告比較不會一大堆寫在一起亂糟糟
  const getters: _GettersTree<State> = {
    getTripleCount: (state) => state.count * 3,
  }
  
  const useStore = defineStore("main", {
    getters,
  });
  \`\`\`
  
  ### actions
  
  與vuex差最多的部分，像是結合vuex的action和mutation。支援async(非同步)行為
  
  \`\`\`tsx
  //...
  const useStore = defineStore("main", {
    actions: {
      addOne() {
        this.count++; // 就像使用vue的data一樣
      },
      async asyncAddCount() {
        const fetchedCount = await someApi();
        this.count += fetchedCount;
      },
    },
  });
  \`\`\`
  
  ### 在組件中使用 {#used-in-component}
  
  Counter.vue
  
  \`\`\`tsx
  <template>
    <button @click="handleAddOne">{{ count }}</button>
  </template>
  
  <script lang="ts">
  import useStore from '~~/store';
  export default defineComponent({
    setup(props) {
      const store = useStore();
      const count = computed(() => store.count)
      const handleAddOne = store.addOne;
  
      return {
        count,
        handleAddOne,
      };
    },
  });
  
  </script>
  \`\`\`
  
  OtherComponent.vue
  
  \`\`\`tsx
  <template>
    <p>{{ tripleCount }}</p>
  </template>
  
  <script lang="ts">
  import useStore from '~~/store';
  
  export default defineComponent({
    setup(props) {
      const store = useStore();
      const tripleCount = computed(() => store.getTripleCount)
  
      return {
        tripleCount,
      };
    },
  });
  
  </script>
  \`\`\`
  
  > 除了放在setup()中，也可以在組件外使用，詳見官方文件:
  > 
  
  [文件連結](https://pinia.vuejs.org/ssr/nuxt.html#using-the-store-outside-of-setup)
  
  ---
  
  這樣我們就裝好pinia，也知道pinia怎麼使用了，跟vuex差不多，只是更簡單、更直覺。
  
  接著以實戰操作取得"使用者"資料作為範例，從實作中直接學習。
  
  ## 實戰範例
  
  - 在頁面任一處取得使用者資料，同步更新至每個組件
  - 使用json placeholder API以模仿真實資料
  - 記得app.vue和layouts/default.vue的寫法很重要，沒設定好可是會無法正確渲染畫面的喔!
  
  app.vue
  
  \`\`\`tsx
  <template>
    <Head>
      <Link rel="icon" href="/favicon.ico" />
      <Title>Pinia Sample 🍍</Title>
    </Head>
    <NuxtLayout>
      <main>
        <NuxtPage />
      </main>
    </NuxtLayout>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "App",
  });
  </script>
  \`\`\`
  
  api/fetchUser.ts
  
  \`\`\`tsx
  import { UserData } from "~~/store";
  
  const fetchUser = async () => {
    const userList = (await fetch(
      "https://jsonplaceholder.typicode.com/users"
    ).then((res) => res.json())) as UserData[];
    const id = Math.round(Math.random() * 10);
    const user = userList[id];
    return user;
  };
  
  export default fetchUser;
  \`\`\`
  
  store/index.ts
  
  \`\`\`tsx
  import { createSlots } from "nuxt3/dist/app/compat/capi";
  import { defineStore } from "pinia";
  import fetchUser from "~~/api/fetchUser";
  
  export interface UserData {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
    };
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
  }
  
  export interface StoreState {
    userData: UserData | null;
  }
  
  const initState: StoreState = {
    userData: null,
  };
  
  const useStore = defineStore("main", {
    state: () => initState,
    actions: {
      setUser(userData: UserData) {
        this.userData = userData;
      },
      resetUser() {
        this.userData = initState.userData;
      },
      async fetchAndSetUser() {
        const user = await fetchUser();
        this.userData = user;
      },
    },
    getters: {
      getUserName: (state): string | undefined => state.userData?.name,
    },
  });
  
  export default useStore;
  \`\`\`
  
  components/Header/index.vue
  
  \`\`\`tsx
  <template>
    <nav>
      <button v-if="!userName" @click="handleLogin">Login!</button>
      <div v-else>
        <p>{{ \`User: \${userName}\` }}</p>
        <button @click="handleLogout">Logout</button>
      </div>
      <hr />
    </nav>
  </template>
  
  <script lang="ts">
  import useStore from "~~/store";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "Header",
    setup(props) {
      const store = useStore();
      const userName = computed(() => store.getUserName);
  
      const handleLogin = store.fetchAndSetUser;
      const handleLogout = store.resetUser;
  
      return {
        userName,
        handleLogin,
        handleLogout,
      };
    },
  });
  </script>
  \`\`\`
  
  layout/default.vue
  
  \`\`\`tsx
  <template>
    <div class="root">
      <Header />
      <slot :key="path" />
    </div>
  </template>
  
  <script lang="ts">
  import Header from "~~/components/Header/index.vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "DefaultLayoutWrapper",
    setup(props) {
      const route = useRoute();
      const path = computed(() => route.path);
  
      return {
        path,
      };
    },
  });
  </script>
  \`\`\`
  
  pages/index.vue
  
  \`\`\`tsx
  <template>
    <h1>Home :)</h1>
    <div class="user-profile">
      <h2 v-if="userProfile">{{ \`User Profile: \${userProfile}\` }}</h2>
      <h2 v-else>User Not Logined :(</h2>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import useStore from "~~/store";
  
  export default defineComponent({
    name: "Home",
    setup(props) {
      const store = useStore();
      const userProfile = computed(() =>
        store.userData ? JSON.stringify(store.userData, undefined, 2) : ""
      );
      return {
        userProfile,
      };
    },
  });
  </script>
  
  <style lang="css" scoped>
  h1 {
    text-align: center;
  }
  .user-profile {
    white-space: pre-wrap;
  }
  </style>
  \`\`\`
  
  ### Demo成品
  
  點擊登入
  
  ![Snipaste_2022-02-23_00-10-34.png](https://imgur.com/O6mvgpH.jpg)
  
  點擊登出
  
  ![Snipaste_2022-02-23_00-10-44.png](https://imgur.com/tXgh5sX.jpg)
  
  ### Repo連結
  
  [https://github.com/ms0223900/nuxt3-pinia-template](https://github.com/ms0223900/nuxt3-pinia-template)
  `,
  tagList: ['nuxt3', 'vue'],
  relatedArticleList: [],
};

export default nuxt3Pinia;
