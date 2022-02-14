const mockArticle = {
  title: '不錯的pattern或寫法',
  description: '用object取代if else, switch...',
  content: `
  ### 用object取代if else, switch
  

  - [x] todo
  
  \`注意以下寫法\`用object好處是方便擴充而且非常直覺! 不過並非所有狀況都適用。
  
  \`\`\`jsx
  // 原本 if else
  function getKey(inputVal='') {
    if(inputVal === 'a') return 'A';
    if(inputVal === 'b') return 'B';
    if(inputVal === 'c') return 'C';
    return 'DEFAULT';
  }
  
  // 改用object
  const keyVal = {
    a: 'A',
    b: 'B',
    c: 'C',
  }
  function getKey(inputVal='') {
    return keyVal[inputVal] ?? 'DEFAULT',
  }
  \`\`\`
  
  ### 組合機制
  
  透過組合(而非繼承)的方式，達到更高的使用彈性，而且更容易針對個別功能抽換修改
  
  當然繼承也是有其必要性，像是React的class component、原生JS物件等
  
  \`\`\`tsx
  function add(...nums) {
    return nums.reduce((p, n) => p + n, 0);
  }
  
  function multiply(...nums) {
    return nums.reduce((p, n) => p * n, 1);
  }
  
  const res = multiply(10, add(1, 2)); // 30
  \`\`\`
  
  ### 主要邏輯的抬升
  
  將主要使用的函式使用寫在程式的上面，閱讀者可以先理解整個程式的流程架構，再將”詳細”函式寫在下方
  
  適用於呼叫方法或函式的各種情境
  
  \`\`\`tsx
  function calcSomething() {
    const res1 = add(//...);
    const res2 = devide(//...);
  
    function add() {//... };
    function devide() { //... };
  
    return res2;
  }
  \`\`\`
  
  ### 只公開必要的
  
  - export 時
      
      \`\`\`tsx
      // calc.js
      
      const abc = () => {};
      
      function onlyCallInThisFile() { //... };
      
      function calc() { //... };
      
      export default calc; // 其他模組只能使用calc
      \`\`\`
      
  - 設計物件時

      \`\`\`tsx
      const Chocolate = (() => {
        const state = {
          sweetLevel: 1,
          melted: 0, // 0 ~ 100
          meltRate: 10,
        }
      
        melt();
      
        function melt() {
          let timer = setInterval(() => {
            if(state.melted === 100) {
              clearInterval(timer);
              return;
            }
            state.melted++;
          }, state.meltRate * 1000)
        }
      
        function getMeltedProcess() { return state.melted; }
      
        return ({
          getMeltedProcess,
        })
      })();
      \`\`\`
  
    
  <h1>Hi</h1>
  
  `,
};

export default mockArticle;
