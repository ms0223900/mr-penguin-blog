Feature: 紀錄帳目

  Scenario: 瀏覽已紀錄的帳目
    Given 應用程序已啟動
    When 我查看我的帳目紀錄
    Then 我應該看到所有已紀錄的帳目
    And 每一筆帳目應該包含金額和類別
