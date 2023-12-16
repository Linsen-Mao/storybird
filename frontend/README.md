# front-end
採用react-bootstrap的框架  
- 安裝方式：
    ```
    npm install react-bootstrap
    ```
- 啟動前端
    ```
    cd ./fronted/react-app
    npm start
    ```
- FAQ   
  1. 未安裝模組：
    ```
    cd ./react-app
    npm install
    ```
  2. 出現useref error 但該檔案未使用或其他 hook、react-router-dom 之問題：  
    請刪除 node_modules 再安裝
    ```
    cd ./react-app
    rm -rf node_modules
    npm install
    ``` 
# back-end
- 安裝方式：
    ```
    npm install
    ```
- 啟動後端
    ```
    cd ./backend
    npm start
    ```
- FAQ   
  1. 未安裝模組：
    ```
    cd ./backend
    npm install
    ```
  2. 出現cors未安裝問題：
     1. 先安裝cors
        ```
        cd ./backend
        npm install cors
        ``` 
     2. 此時還是會有問題，請至`./backend/src/index.ts`中：
        ```
        import cors from "cors";
        ```
        並在錯誤波浪線上點選快速修復。  
        (適用於vscode)

# 網頁執行
開啟前端：
```
 cd ./react-app
 npm start
```
開啟後端：
```
cd ./backend
npm start
```
即可執行網頁