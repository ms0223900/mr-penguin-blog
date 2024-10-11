Feature: 畫面正常渲染

  Scenario: 可以正常輸入數字
    Given 應用程式已啟動
    When 我點擊按鈕 1, 2, 3
    Then 畫面應該顯示 "$123"
