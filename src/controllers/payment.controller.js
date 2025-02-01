const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createInstallments = async (req, res) => {
    try {
        const { userId, amount, numberOfInstallments } = req.body;

        // Validações básicas
        if (!userId || !amount || !numberOfInstallments) {
            return res.status(400).json({
                error: 'Dados incompletos. Usuário, valor e número de parcelas são obrigatórios.'
            });
        }

        // Verifica se o usuário existe
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return res.status(404).json({
                error: 'Usuário não encontrado.'
            });
        }

        // Calcula o valor de cada parcela
        const installmentAmount = parseFloat((amount / numberOfInstallments).toFixed(2));

        // Cria array para armazenar as promessas de criação das parcelas
        const installmentPromises = [];

        // Gera as parcelas
        for (let i = 0; i < numberOfInstallments; i++) {
            installmentPromises.push(
                prisma.payment.create({
                    data: {
                        userId,
                        amount: installmentAmount,
                        status: 'PENDING'
                    }
                })
            );
        }

        // Cria todas as parcelas no banco de dados
        const createdInstallments = await prisma.$transaction(installmentPromises);

        return res.status(201).json({
            message: 'Mensalidades geradas com sucesso',
            installments: createdInstallments
        });

    } catch (error) {
        console.error('Erro ao gerar mensalidades:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor ao gerar mensalidades.'
        });
    }
}

const getInstallmentsFromUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Convertendo userId para número
        const userIdNumber = parseInt(userId);

        // Validação adicional
        if (isNaN(userIdNumber)) {
            return res.status(400).json({
                error: 'ID do usuário inválido'
            });
        }

        const installments = await prisma.payment.findMany({
            where: { userId: userIdNumber }
        });

        return res.status(200).json(installments);
    } catch (error) {
        console.error('Erro ao buscar mensalidades:', error);
        return res.status(500).json({
            error: 'Erro ao buscar mensalidades'
        });
    }
}

const getAllInstallments = async (req, res) => {
    try {
        // Busca todos os pagamentos agrupados por usuário
        const installmentsByUser = await prisma.payment.groupBy({
            by: ['userId'],
            _count: {
                status: true
            },
            _sum: {
                amount: true
            },
            where: {
                user: {
                    role: 'STUDENT'
                }
            }
        });

        // Busca informações detalhadas dos usuários
        const usersWithPayments = await Promise.all(
            installmentsByUser.map(async (item) => {
                const user = await prisma.user.findUnique({
                    where: { id: item.userId },
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                });

                // Calcula valores específicos para mensalidades pendentes
                const pendingPayments = await prisma.payment.aggregate({
                    where: {
                        userId: item.userId,
                        status: 'PENDING'
                    },
                    _count: true,
                    _sum: {
                        amount: true
                    }
                });

                // Calcula valores específicos para mensalidades pagas
                const paidPayments = await prisma.payment.aggregate({
                    where: {
                        userId: item.userId,
                        status: 'PAID'
                    },
                    _sum: {
                        amount: true
                    }
                });

                return {
                    user: user,
                    totalInstallments: item._count.status,
                    pendingInstallments: pendingPayments._count,
                    totalPendingAmount: pendingPayments._sum.amount || 0,
                    totalPaidAmount: paidPayments._sum.amount || 0
                };
            })
        );

        return res.status(200).json(usersWithPayments);

    } catch (error) {
        console.error('Erro ao buscar resumo de mensalidades:', error);
        return res.status(500).json({
            error: 'Erro ao buscar resumo de mensalidades'
        });
    }
};

module.exports = {
    createInstallments,
    getInstallmentsFromUser,
    getAllInstallments
}