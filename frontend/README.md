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
- 加入環境：
  1. 在backend資料夾下新增`.env`
  2. 寫入：
    ```
    DATABASE_URL=postgresql://storybird:200168mls@35.236.179.162:5432/storybird
    JWT_SECRET_KEY=c708530aface12ea99e0ccada12129cf68c3c5565d7cfb2839f136c24d19756a498d0abccb14b635ae7bef2e7f1ac750c8df2715af55072bd9af67e7d23063a1
    JWT_EXPIRATION=1d
    PORT=4000
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