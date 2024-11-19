const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const testRoutes = require('./routes/test');
app.use('/api/test', testRoutes);


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  useEffect(() => {
    fetch('/api/test')
        .then((res) => res.text())
        .then((data) => console.log(data));
}, []);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
