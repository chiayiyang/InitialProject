const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');

// 中间件：解析请求体中的 JSON 数据
app.use(express.json());

// 静态文件中间件，用于提供HTML文件
app.use(express.static('public'));

// 处理搜索请求的路由
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase(); // 获取搜索关键字

  // 读取 JSON 文件中的数据
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // 解析 JSON 数据
    const jsonData = JSON.parse(data);

    // 查找关键字对应的HTML页面
    const page = jsonData[keyword];

    if (page) {
      // 如果找到匹配的页面，则进行跳转
      const pagePath = path.join(__dirname, 'public', page);
      res.sendFile(pagePath);
    } else {
      // 如果没有找到匹配的页面，则返回错误页面或其他处理方式
      res.status(404).send('Page not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

