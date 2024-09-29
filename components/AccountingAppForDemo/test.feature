Feature: 畫面正常渲染

  Scenario: 畫面顯示初始金額
    Given 應用程式已啟動
    When 畫面顯示
    Then 我應該看到兩個 "$0" 金額的文字

  Scenario: 可以正常輸入數字
    Given 應用程式已啟動
    When 我點擊按鈕 1, 2, 3
    Then 畫面應該顯示 "$123"
