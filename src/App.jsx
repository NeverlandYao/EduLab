import React, { useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  FlaskConical, 
  Library, 
  Settings, 
  Bell, 
  User, 
  Wind, 
  Music, 
  Plus,
  BookOpen,
  PenTool,
  Database,
  BrainCircuit,
  Quote,
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const workflows = [
  {
    id: 'lit-review',
    title: '文献综述',
    description: '通过多模态分析技术，一键从海量 PDF 文献中提取研究脉络与核心观点。',
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    tag: '精选工作流',
    category: '文献阅读',
    color: 'bg-blue-50'
  },
  {
    id: 'paper-polish',
    title: '论文润色',
    description: '基于顶会论文风格，深度优化学术用词与逻辑连贯性，并检查合规性。',
    icon: <PenTool className="w-6 h-6 text-pink-500" />,
    tag: '写作辅助',
    category: '论文写作',
    color: 'bg-pink-50'
  },
  {
    id: 'data-clean',
    title: '数据清洗自动化',
    description: '自动识别并修复实验数据中的离群值与缺失项，导出符合统计标准的结果。',
    icon: <Database className="w-6 h-6 text-green-500" />,
    tag: '数据实验室',
    category: '数据分析',
    color: 'bg-green-50'
  },
  {
    id: 'theory-derivation',
    title: '理论框架推导',
    description: '利用 LLM 辅助进行逻辑推理，协助构建严谨的研究假设与理论模型。',
    icon: <BrainCircuit className="w-6 h-6 text-orange-500" />,
    tag: '逻辑推理',
    category: '实验模拟',
    color: 'bg-orange-50'
  },
  {
    id: 'citation-mgmt',
    title: '引用格式管理',
    description: '批量转换 BibTeX、APA 等多种学术格式，并自动抓取缺失的元数据。',
    icon: <Quote className="w-6 h-6 text-purple-500" />,
    tag: '工具辅助',
    category: '会议投稿',
    color: 'bg-purple-50'
  }
];

const categories = ['全部', '文献阅读', '论文写作', '实验模拟', '数据分析', '会议投稿'];

function App() {
  const [activeCategory, setActiveCategory] = useState('文献阅读');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [researchTitle, setResearchTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleStartWorkflow = (id) => {
    if (id === 'lit-review') {
      setIsModalOpen(true);
    }
  };

  const handleSubmitLitReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiToken = import.meta.env.VITE_COZE_API_TOKEN;
      // 使用代理路径以解决跨域问题
      const apiUrl = '/api-coze/run';

      if (!apiToken || apiToken === 'your_personal_access_token_here') {
        throw new Error('请先在 .env 文件中配置 VITE_COZE_API_TOKEN');
      }

      const response = await axios.post(apiUrl, {
        research_title: researchTitle
      }, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });
      setResult(response.data);
    } catch (err) {
      console.error('API Error Details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = '请求失败';
      if (err.response?.status === 500) {
        const detail = err.response.data?.detail;
        if (detail && detail.error_message) {
          errorMessage = `工作流执行错误: ${detail.error_message}`;
          
          // 为常见的 LangGraph 导入错误提供提示
          if (detail.error_message.includes("langgraph.checkpoint.postgres")) {
            errorMessage += " (提示: 可能是 Coze 环境中缺少 langgraph-checkpoint-postgres 依赖，或者导入路径已变更)";
          }
        } else {
          errorMessage = `服务器内部错误 (500): 请检查 Coze 工作流配置`;
        }
      } else {
        errorMessage = err.response?.data?.message || err.message || '网络连接异常';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-800 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FlaskConical className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Edu-Lab <span className="font-medium text-slate-500">智能科研工作台</span></h1>
          <nav className="ml-12 flex items-center gap-8">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">仪表盘</a>
            <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1 -mb-1">发现实验室</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">文献库</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-50 rounded-full px-4 py-1.5 border border-slate-100">
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
              <Wind className="w-3.5 h-3.5" /> 深呼吸
            </button>
            <div className="w-px h-3 bg-slate-200 mx-2" />
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
              <Music className="w-3.5 h-3.5" /> 轻音乐
            </button>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif italic text-slate-800 mb-4">工作流发现实验室</h2>
          <p className="text-slate-400 mb-8">探索专为学术卓越设计的智能化、直观的 AI 工作流。</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="搜索学术工作流，如 '文献综述' 或 '数据清理'..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-600"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold">科研分类</h3>
          </div>
          <div className="flex gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.filter(w => activeCategory === '全部' || w.category === activeCategory).map(workflow => (
            <div 
              key={workflow.id}
              className="group bg-white rounded-[32px] p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", workflow.color)}>
                {workflow.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{workflow.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                {workflow.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-400">{workflow.tag}</span>
                <button 
                  onClick={() => handleStartWorkflow(workflow.id)}
                  className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:gap-3 transition-all"
                >
                  立即启动 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Create Custom Card */}
          <div className="bg-white rounded-[32px] p-8 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
            </div>
            <h4 className="text-xl font-bold mb-2">创建自定义工作流</h4>
            <p className="text-slate-400 text-sm">通过可视化拖拽定义您的专属科研逻辑</p>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-white text-slate-400 border border-slate-100 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <span className="text-xl font-bold">?</span>
        </button>
      </div>

      {/* Lit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">文献综述工作流</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitLitReview} className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">研究题目 *</label>
                <input 
                  type="text"
                  required
                  value={researchTitle}
                  onChange={(e) => setResearchTitle(e.target.value)}
                  placeholder="例如：人工智能在早期肺癌诊断中的应用综述"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {result && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 max-h-48 overflow-y-auto">
                  <h4 className="font-bold mb-2">生成结果：</h4>
                  <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> 正在处理...
                  </>
                ) : (
                  '开始生成文献综述'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
