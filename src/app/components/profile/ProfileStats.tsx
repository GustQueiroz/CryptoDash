export function ProfileStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
        <h3 className="text-sm text-gray-400">Portfolio Total</h3>
        <p className="text-xl font-bold text-white mt-1">R$ 15.432,00</p>
        <span className="text-green-500 text-sm">+12.5% este mês</span>
      </div>

      <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
        <h3 className="text-sm text-gray-400">Moedas</h3>
        <p className="text-xl font-bold text-white mt-1">12</p>
        <span className="text-gray-400 text-sm">Ativos diferentes</span>
      </div>

      <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
        <h3 className="text-sm text-gray-400">Transações</h3>
        <p className="text-xl font-bold text-white mt-1">156</p>
        <span className="text-gray-400 text-sm">Últimos 30 dias</span>
      </div>

      <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
        <h3 className="text-sm text-gray-400">Lucro Total</h3>
        <p className="text-xl font-bold text-white mt-1">R$ 3.245,00</p>
        <span className="text-green-500 text-sm">+8.3% desde o início</span>
      </div>
    </div>
  );
}
