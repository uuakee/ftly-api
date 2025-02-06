const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const schoolRoutes = require('./routes/school.routes');
const courseRoutes = require('./routes/course.routes');
const paymentRoutes = require('./routes/payment.routes');
const userRoutes = require('./routes/user.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const app = express();

app.use(cors()); // Permite todas as origens
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/course', courseRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/user', userRoutes)
app.use('/api/enrollment', enrollmentRoutes)

const PORT = 1938;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
