import React, { useState } from 'react';
import { Terminal, Shield, Cpu, Activity, Zap, CheckCircle, Copy, Code2, Layers, CpuIcon, Globe, Lock } from 'lucide-react';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group/code my-8">
            <div className="absolute inset-0 bg-[#FFD700] rounded-3xl -m-[1px] opacity-0 group-hover/code:opacity-10 transition-opacity blur-sm" />
            <div className="absolute top-0 right-12 px-4 py-1.5 bg-slate-100 border-x border-b border-slate-200 rounded-b-xl text-[10px] font-black text-blue-600 uppercase tracking-widest italic z-10 backdrop-blur-md">
                Protocol Buffer v3
            </div>
            <pre className="bg-white text-[#B3CEE5] p-10 rounded-3xl overflow-x-auto font-mono text-sm leading-relaxed border-2 border-slate-200 shadow-[inner_0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#1E4A6F] to-transparent opacity-40" />
                <code>{code}</code>
            </pre>
            <button
                onClick={copyToClipboard}
                className="absolute top-6 right-6 p-4 bg-slate-100 hover:bg-[#FFD700] text-slate-800/40 hover:text-slate-800 rounded-[22px] transition-all border border-slate-200 group/btn shadow-2xl active:scale-95"
            >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />}
            </button>
        </div>
    );
};

const TracingGuide: React.FC = () => {
    const [lang, setLang] = useState<'py' | 'ts'>('py');

    const snippets = {
        py: {
            install: `pip install uv\nuvx arize-tracing-assistant@latest\npip install opentelemetry-sdk arize-otel`,
            setup: `from opentelemetry import trace\nfrom arize_otel import register\n\n# Neural Initialization\ntracer_provider = register(\n    space_id="XETA_SPACE_ID",\n    api_key="XETA_API_KEY",\n    project_name="xetapay-core-v9"\n)\ntracer = trace.get_tracer(__name__)`,
            manual: `with tracer.start_as_current_span(\n    "asset_consensus",\n    attributes={"settlement.id": "XETA_77341"}\n) as span:\n    # Logic Execution\n    span.set_attribute("consensus.latency", "12ms")\n    span.set_status(Status(StatusCode.OK))`
        },
        ts: {
            install: `npm install @opentelemetry/sdk-node \\\n            @opentelemetry/instrumentation \\\n            @opentelemetry/exporter-trace-otlp-grpc \\\n            @arizeai/openinference-semantic-conventions`,
            setup: `import { NodeSDK } from "@opentelemetry/sdk-node";\nimport { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";\n\nconst sdk = new NodeSDK({\n    resource: new Resource({ "project.name": "xetapay-core-v9" }),\n    spanProcessorOptions: {\n        exporter: new OTLPTraceExporter({ url: "https://otlp.arize.com/v1" })\n    }\n});\nsdk.start();`,
            manual: `import { trace } from "@opentelemetry/api";\n\nconst tracer = trace.getTracer("xetapay-core");\ntracer.startActiveSpan("asset_consensus", (span) => {\n    span.setAttribute("settlement.id", "XETA_77341");\n    span.setAttribute("consensus.latency", "12ms");\n    span.end();\n});`
        }
    };

    return (
        <div className="bg-white rounded-[40px] sm:rounded-[70px] p-8 sm:p-16 space-y-12 sm:space-y-20 animate-fadeIn max-w-5xl mx-auto border-2 border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[80vw] h-[80vw] sm:w-[500px] sm:h-[500px] bg-[#1E4A6F] opacity-10 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />

            {/* Header Strategy */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="p-6 bg-slate-100 rounded-[35px] shadow-2xl skew-x-[-15deg] border-2 border-slate-200 hover:rotate-6 transition-transform group">
                            <CpuIcon className="w-14 h-14 text-[#FFD700] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="h-2 w-20 bg-[#FFD700] rounded-full hidden sm:block" />
                    </div>
                    <div>
                        <h2 className="text-4xl sm:text-6xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Intelligence <span className="text-[#FFD700]">Tracing</span></h2>
                        <p className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] sm:tracking-[0.5em] mt-6 italic">XETA-PHOENIX OBSERVABILITY INFRASTRUCTURE</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-2.5 rounded-[30px] border border-slate-200 shadow-2xl relative group">
                    <div className={`absolute top-2.5 bottom-2.5 w-[calc(50%-10px)] bg-[#FFD700] rounded-[22px] transition-all duration-700 shadow-2xl ${lang === 'ts' ? 'left-[calc(50%+5px)]' : 'left-2.5'}`} />
                    <button
                        onClick={() => setLang('py')}
                        className={`px-10 py-5 rounded-[22px] text-xs font-black uppercase tracking-widest italic z-10 transition-colors duration-500 flex items-center gap-3 ${lang === 'py' ? 'text-slate-800' : 'text-blue-600'}`}
                    >
                        <Code2 className="w-5 h-5" />
                        Python
                    </button>
                    <button
                        onClick={() => setLang('ts')}
                        className={`px-10 py-5 rounded-[22px] text-xs font-black uppercase tracking-widest italic z-10 transition-colors duration-500 flex items-center gap-3 ${lang === 'ts' ? 'text-slate-800' : 'text-blue-600'}`}
                    >
                        <Layers className="w-5 h-5" />
                        TypeScript
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                <section className="space-y-10 group">
                    <div className="relative">
                        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-[#FFD700] opacity-0 group-hover:opacity-100 transition-all" />
                        <div className="flex items-center gap-6">
                            <span className="text-5xl font-black text-slate-800/5 group-hover:text-[#FFD700]/20 transition-colors duration-700 italic">01</span>
                            <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Core Injection</h3>
                        </div>
                    </div>
                    <p className="text-xl text-[#B3CEE5] font-medium italic leading-relaxed">
                        Deploy the high-fidelity telemetry stack to your node architecture.
                    </p>
                    <CodeBlock code={snippets[lang].install} />
                </section>

                <section className="space-y-10 group">
                    <div className="relative">
                        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-[#FFD700] opacity-0 group-hover:opacity-100 transition-all" />
                        <div className="flex items-center gap-6">
                            <span className="text-5xl font-black text-slate-800/5 group-hover:text-[#FFD700]/20 transition-colors duration-700 italic">02</span>
                            <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Neural Handshake</h3>
                        </div>
                    </div>
                    <p className="text-xl text-[#B3CEE5] font-medium italic leading-relaxed">
                        Authorize the secure gateway to export intelligence shards to Phoenix.
                    </p>
                    <CodeBlock code={snippets[lang].setup} />
                </section>
            </div>

            <section className="space-y-10 relative z-10 group">
                <div className="flex items-center gap-8">
                    <span className="text-6xl font-black text-slate-800/5 group-hover:text-[#FFD700]/20 transition-colors duration-700 italic">03</span>
                    <h3 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Linear Observation</h3>
                </div>
                <p className="text-xl text-[#B3CEE5] font-medium italic leading-relaxed max-w-3xl">
                    Wrap critical consensus logic to record depth, latency, and full asset lineage across the fabric.
                </p>
                <CodeBlock code={snippets[lang].manual} />
            </section>

            {/* CTA Strategy */}
            <div className="p-8 sm:p-16 bg-slate-100 rounded-[40px] sm:rounded-[60px] text-slate-800 relative overflow-hidden group/cta shadow-2xl border border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E4A6F] to-transparent opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] sm:w-[400px] sm:h-[400px] bg-[#FFD700] opacity-5 rounded-full blur-[100px] group-hover/cta:scale-150 transition-all duration-1000" />

                <div className="relative z-10 flex flex-col xl:row items-center justify-between gap-12">
                    <div className="flex items-center gap-10">
                        <div className="p-8 bg-slate-100 rounded-[35px] border border-slate-200 shadow-2xl relative">
                            <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-2xl opacity-10 animate-pulse" />
                            <Terminal className="w-16 h-16 text-[#FFD700] relative z-10" />
                        </div>
                        <div>
                            <p className="text-5xl font-black italic tracking-tighter uppercase leading-none mb-4">Gateway Online</p>
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 text-emerald-400" />
                                <p className="text-xs font-black text-blue-600 italic uppercase tracking-[0.5em]">Global Monitoring Mesh Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:row gap-8 w-full xl:w-auto">
                        <button className="px-14 py-8 bg-[#FFD700] text-slate-800 rounded-[30px] font-black uppercase tracking-[0.3em] italic hover:scale-[1.03] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4">
                            <CheckCircle className="w-6 h-6" />
                            Launch Console
                        </button>
                        <button className="px-14 py-8 bg-slate-100 text-slate-800 border-2 border-slate-200 rounded-[30px] font-black uppercase tracking-[0.3em] italic hover:bg-slate-100 transition-all flex items-center justify-center gap-4 shadow-2xl">
                            <Lock className="w-6 h-6 opacity-40" />
                            Access Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TracingGuide;
