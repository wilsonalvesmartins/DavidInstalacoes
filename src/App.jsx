import React, { useState } from 'react';
import { 
  User, Lock, LogOut, LayoutDashboard, FileText, 
  Settings, Download, Eye, Paperclip, CheckCircle2, 
  Calendar, FilePlus, ChevronRight, UploadCloud,
  Pencil, PlusCircle, X
} from 'lucide-react';

// --- DADOS MOCADOS INICIAIS ---
const INITIAL_USER = {
  name: "David C da Silva",
  company: "DAVID C DA SILVA INSTALACOES",
  logo: "https://ui-avatars.com/api/?name=DS&background=0D8ABC&color=fff&size=128"
};

const INITIAL_CONTRACTS = [
  {
    id: "CTR-2024-0506",
    providerName: "Claudir Nunes Ribeiro Junior",
    cnpj: "54.718.709/0001-56",
    service: "Instalação, ativação e configurações de equipamentos de internet (SCM)",
    startDate: "2024-05-06",
    endDate: "2026-05-06",
    status: "Ativo",
    value: "Variável (R$30,00 a R$150,00 por O.S)",
    fileName: "Contrato_Claudir_Nunes_Assinado.pdf",
    addendums: [
      {
        id: "ADT-001",
        title: "1º Termo Aditivo - Prorrogação de Prazo",
        date: "2025-05-06",
        description: "Prorrogação do prazo de vigência por mais 12 meses.",
        fileName: "1o_Aditivo_Claudir.pdf"
      }
    ]
  }
];

// --- COMPONENTES ---

const LoginScreen = ({ onLogin, user }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'administrador' && password === '12345678') {
      onLogin();
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <img 
            src={user.logo} 
            alt="Logo da Empresa" 
            className="w-24 h-24 rounded-full mb-4 shadow-sm"
          />
          <h1 className="text-2xl font-bold text-slate-800">Portal de Contratos</h1>
          <p className="text-slate-500 text-sm mt-1">{user.company}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: administrador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                className="pl-10 w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md flex justify-center items-center"
          >
            Acessar Portal
          </button>
        </form>
      </div>
    </div>
  );
};

const ContractDetailView = ({ contract, onBack, onEdit, onUpdateContract }) => {
  const [showAddendumForm, setShowAddendumForm] = useState(false);
  const [newAddendum, setNewAddendum] = useState({ title: '', description: '', date: '', file: null });

  const handleDownload = (fileName) => {
    alert(`Iniciando download do arquivo: ${fileName}\n\n(Esta é uma simulação. No ambiente real, o download do PDF será iniciado automaticamente.)`);
  };

  const handleSaveAddendum = (e) => {
    e.preventDefault();
    const addendumToSave = {
      id: `ADT-${Math.floor(Math.random() * 1000)}`,
      title: newAddendum.title,
      description: newAddendum.description,
      date: newAddendum.date || new Date().toISOString().split('T')[0],
      fileName: newAddendum.file ? newAddendum.file.name : "Aditivo_Documento.pdf"
    };
    
    const updatedContract = {
      ...contract,
      addendums: [...(contract.addendums || []), addendumToSave]
    };

    onUpdateContract(updatedContract);
    setShowAddendumForm(false);
    setNewAddendum({ title: '', description: '', date: '', file: null });
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
          Voltar para Meus Contratos
        </button>
        
        <button 
          onClick={() => onEdit(contract)}
          className="flex items-center text-slate-600 hover:text-blue-600 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Editar Contrato
        </button>
      </div>

      <div className="space-y-6">
        {/* Card Principal de Detalhes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Detalhes do Contrato</h2>
              <p className="text-slate-500 font-mono text-sm mt-1">ID: {contract.id}</p>
            </div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> {contract.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Prestador / Contratada</p>
              <p className="text-slate-800 font-medium text-lg">{contract.providerName}</p>
              <p className="text-slate-500 text-sm mt-1">CNPJ/CPF: {contract.cnpj}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Objeto do Serviço</p>
              <p className="text-slate-700">{contract.service}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data de Início</p>
              <p className="text-slate-800 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {contract.startDate?.split('-').reverse().join('/')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data de Término</p>
              <p className="text-slate-800 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {contract.endDate?.split('-').reverse().join('/')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Remuneração Base</p>
              <p className="text-slate-800 font-medium">{contract.value || "Não especificado"}</p>
            </div>
          </div>
        </div>

        {/* Card de Documentos e Aditivos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
             <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Paperclip className="w-5 h-5 mr-2 text-blue-600" />
              Documentos Anexados
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Contrato Original */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Contrato Principal</h4>
              <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded mr-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{contract.fileName || "Contrato_Assinado.pdf"}</h5>
                    <p className="text-xs text-slate-500">Documento original (PDF)</p>
                  </div>
                </div>
                <button onClick={() => handleDownload(contract.fileName || "Contrato_Assinado.pdf")} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2.5 rounded-md transition-colors flex items-center font-medium text-sm">
                  <Download className="w-4 h-4 mr-2" /> Baixar PDF
                </button>
              </div>
            </div>

            {/* Aditivos */}
            <div>
              <div className="flex justify-between items-center mb-3 mt-4">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aditivos</h4>
                {!showAddendumForm && (
                  <button onClick={() => setShowAddendumForm(true)} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                    <PlusCircle className="w-4 h-4 mr-1" /> Novo Aditivo
                  </button>
                )}
              </div>

              {/* Formulário Novo Aditivo */}
              {showAddendumForm && (
                <form onSubmit={handleSaveAddendum} className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-bold text-blue-800">Adicionar Termo Aditivo</h5>
                    <button type="button" onClick={() => setShowAddendumForm(false)} className="text-blue-400 hover:text-blue-600"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Título</label>
                      <input type="text" required value={newAddendum.title} onChange={e => setNewAddendum({...newAddendum, title: e.target.value})} className="w-full rounded border-slate-300 py-2 px-3 text-sm" placeholder="Ex: 2º Termo Aditivo" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data</label>
                      <input type="date" required value={newAddendum.date} onChange={e => setNewAddendum({...newAddendum, date: e.target.value})} className="w-full rounded border-slate-300 py-2 px-3 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Descrição</label>
                      <input type="text" value={newAddendum.description} onChange={e => setNewAddendum({...newAddendum, description: e.target.value})} className="w-full rounded border-slate-300 py-2 px-3 text-sm" placeholder="Resumo do que foi alterado..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Arquivo PDF</label>
                      <input type="file" accept=".pdf" required onChange={e => setNewAddendum({...newAddendum, file: e.target.files[0]})} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">Salvar Aditivo</button>
                  </div>
                </form>
              )}

              {/* Lista de Aditivos */}
              <div className="space-y-3">
                {(!contract.addendums || contract.addendums.length === 0) && !showAddendumForm && (
                  <p className="text-sm text-slate-500 italic">Nenhum aditivo registrado.</p>
                )}
                {contract.addendums?.map(addendum => (
                  <div key={addendum.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-start">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded mr-4 mt-0.5">
                        <FilePlus className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800">{addendum.title}</h5>
                        <p className="text-sm text-slate-600 mt-0.5">{addendum.description}</p>
                        <p className="text-xs font-medium text-blue-600 mt-1">Data: {addendum.date?.split('-').reverse().join('/')}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(addendum.fileName)} className="text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 p-2 rounded-md transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ContractForm = ({ initialData, onCancel, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    id: `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    providerName: '',
    cnpj: '',
    service: '',
    startDate: '',
    endDate: '',
    value: '',
    status: 'Ativo',
    fileName: '',
    addendums: []
  });

  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (file) {
      finalData.fileName = file.name;
    } else if (!finalData.fileName) {
      finalData.fileName = "Contrato_Novo_Assinado.pdf";
    }
    onSave(finalData);
  };

  const isEditing = !!initialData;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Editar Contrato' : 'Registrar Novo Contrato'}</h2>
          <p className="text-slate-500 mt-1">{isEditing ? 'Atualize as informações do prestador.' : 'Preencha os dados e faça o upload do documento assinado.'}</p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Prestador / Contratada</label>
              <input type="text" value={formData.providerName} onChange={e => setFormData({...formData, providerName: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: João da Silva ME" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ / CPF</label>
              <input type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="00.000.000/0001-00" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Remuneração / Valor (Opcional)</label>
              <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: R$ 5.000,00 ou Variável" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Objeto do Serviço</label>
              <input type="text" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Instalação de Fibra Óptica" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Término (Opcional)</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {!isEditing && (
            <div className="border-t border-slate-100 pt-6 mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload do Contrato Principal (PDF)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors relative">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={e => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  title="Clique para enviar"
                />
                <div className="space-y-1 text-center">
                  <UploadCloud className={`mx-auto h-12 w-12 ${file ? 'text-blue-500' : 'text-slate-400'}`} />
                  <div className="flex text-sm text-slate-600 justify-center">
                    <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      {file ? file.name : 'Faça o upload de um arquivo'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">PDF até 10MB</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              {isEditing ? 'Salvar Alterações' : 'Registrar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileSettings = ({ user, onSaveUser }) => {
  const [profileData, setProfileData] = useState(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUser(profileData);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Meu Perfil</h2>
        <p className="text-slate-500 mt-1">Gerencie suas informações da empresa.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-6 mb-8 border-b border-slate-100 pb-8">
          <img src={profileData.logo} alt="Logo" className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-sm" />
          <div>
            <h3 className="text-lg font-bold text-slate-800">{profileData.name}</h3>
            <p className="text-slate-500 text-sm">{profileData.company}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seu Nome / Responsável</label>
            <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
            <input type="text" value={profileData.company} onChange={e => setProfileData({...profileData, company: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL da Logo (Avatar)</label>
            <input type="url" value={profileData.logo} onChange={e => setProfileData({...profileData, logo: e.target.value})} className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-400 mt-1">Cole um link válido para a imagem da logo.</p>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Atualizar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DashboardApp = ({ user, onLogout, onSaveUser }) => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [selectedContractId, setSelectedContractId] = useState(null);

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  const handleSaveContract = (contractData) => {
    if (activeTab === 'edit') {
      // Edit
      setContracts(contracts.map(c => c.id === contractData.id ? contractData : c));
      setSelectedContractId(contractData.id); // Voltar pros detalhes
      setActiveTab('details');
    } else {
      // New
      setContracts([contractData, ...contracts]);
      setActiveTab('contracts');
    }
  };

  const handleUpdateContractData = (updatedContract) => {
    setContracts(contracts.map(c => c.id === updatedContract.id ? updatedContract : c));
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <ProfileSettings user={user} onSaveUser={onSaveUser} />;
    }

    if (activeTab === 'new' || activeTab === 'edit') {
      return (
        <ContractForm 
          initialData={activeTab === 'edit' ? selectedContract : null} 
          onCancel={() => activeTab === 'edit' ? setActiveTab('details') : setActiveTab('contracts')} 
          onSave={handleSaveContract} 
        />
      );
    }

    if (activeTab === 'details' && selectedContract) {
      return (
        <ContractDetailView 
          contract={selectedContract} 
          onBack={() => {setSelectedContractId(null); setActiveTab('contracts');}} 
          onEdit={(c) => setActiveTab('edit')}
          onUpdateContract={handleUpdateContractData}
        />
      );
    }

    if (activeTab === 'contracts') {
      return (
        <div className="animate-fade-in">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Meus Contratos</h2>
              <p className="text-slate-500 mt-1">Gerencie seus contratos ativos e aditivos.</p>
            </div>
            <button 
              onClick={() => setActiveTab('new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-sm"
            >
              <FilePlus className="w-5 h-5 mr-2" />
              Novo Contrato
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Prestador</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Serviço</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vigência</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                      Nenhum contrato registrado ainda. Clique em "Novo Contrato" para começar.
                    </td>
                  </tr>
                ) : (
                  contracts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {item.providerName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{item.providerName}</div>
                            <div className="text-sm text-slate-500">{item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 truncate w-48">{item.service}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.addendums?.length || 0} Aditivo(s)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{item.startDate?.split('-').reverse().join('/')}</div>
                        <div className="text-xs text-slate-500">até {item.endDate ? item.endDate.split('-').reverse().join('/') : 'Indeterminado'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => {setSelectedContractId(item.id); setActiveTab('details');}}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Visualizar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'overview') {
      return (
        <div className="animate-fade-in space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Visão Geral</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
              <div className="p-4 bg-blue-100 rounded-lg text-blue-600 mr-4">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Contratos Ativos</p>
                <p className="text-3xl font-bold text-slate-800">{contracts.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
              <div className="p-4 bg-yellow-100 rounded-lg text-yellow-600 mr-4">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">A Vencer (30 dias)</p>
                <p className="text-3xl font-bold text-slate-800">0</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
              <div className="p-4 bg-green-100 rounded-lg text-green-600 mr-4">
                <Paperclip className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Aditivos</p>
                <p className="text-3xl font-bold text-slate-800">
                  {contracts.reduce((total, contract) => total + (contract.addendums?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const menuConfig = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'contracts', label: 'Meus Contratos', icon: FileText },
    { id: 'profile', label: 'Meu Perfil', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-800 flex flex-col items-center">
          <img src={user.logo} alt="Logo" className="w-16 h-16 rounded-lg mb-3 shadow-md bg-white p-1 object-cover" />
          <h2 className="font-bold text-white text-center text-sm">{user.company}</h2>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuConfig.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'contracts' && ['new', 'edit', 'details'].includes(activeTab));
            return (
              <button 
                key={item.id}
                onClick={() => {setActiveTab(item.id); setSelectedContractId(null);}}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="w-5 h-5 mr-3" /> {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white h-20 border-b border-slate-200 flex items-center px-8 shadow-sm justify-between z-0">
          <h1 className="text-xl font-medium text-slate-800">
            Olá, <span className="font-bold">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden md:block">
               <p className="text-sm font-bold text-slate-800">{user.name}</p>
               <p className="text-xs text-slate-500">Administrador</p>
             </div>
             <img src={user.logo} alt="Avatar" className="w-10 h-10 rounded-full bg-blue-100 border-2 border-slate-200 shadow-sm object-cover" />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} user={user} />;
  }

  return <DashboardApp user={user} onSaveUser={setUser} onLogout={() => setIsLoggedIn(false)} />;
}
