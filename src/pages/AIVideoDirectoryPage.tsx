import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';

interface AIVideoModel {
    id: string;
    name: string;
    provider: string;
    description: string;
    features: string[];
    pricing: string;
    website: string;
    maxDuration: string;
    quality: string;
    avatar: string;
    color: string;
}

const aiVideoModels: AIVideoModel[] = [
    {
        id: 'sora',
        name: 'Sora',
        provider: 'OpenAI',
        description: 'Advanced AI model that creates realistic and imaginative scenes from text instructions. Capable of generating videos up to 60 seconds with remarkable consistency.',
        features: ['Text-to-Video', 'Image-to-Video', 'Video Extension', 'Physics Simulation', 'Complex Scene Understanding'],
        pricing: 'Credit-based',
        website: 'https://openai.com/sora',
        maxDuration: '60 seconds',
        quality: 'Excellent',
        avatar: '🎬',
        color: '#10a37f'
    },
    {
        id: 'runway-gen3',
        name: 'Gen-3 Alpha',
        provider: 'Runway',
        description: 'Next-generation AI video creation tool with enhanced temporal consistency, motion quality, and prompt adherence. Sets new standards for AI video generation.',
        features: ['Text-to-Video', 'Image-to-Video', 'Video-to-Video', 'Motion Brush', 'Advanced Controls'],
        pricing: 'Subscription',
        website: 'https://runwayml.com',
        maxDuration: '10 seconds (free), 60 seconds (pro)',
        quality: 'Excellent',
        avatar: '🎥',
        color: '#9d4edd'
    },
    {
        id: 'pika',
        name: 'Pika',
        provider: 'Pika Labs',
        description: 'Fast and intuitive AI video generator that excels at creating short, dynamic videos from text, images, or existing footage.',
        features: ['Text-to-Video', 'Image-to-Video', 'Video Editing', 'Sound Effects', 'Lip Sync'],
        pricing: 'Freemium',
        website: 'https://pika.art',
        maxDuration: 'Up to 60 seconds',
        quality: 'Good',
        avatar: '✨',
        color: '#f72585'
    },
    {
        id: 'kling',
        name: 'Kling',
        provider: 'Kuaishou',
        description: 'Powerful AI video generation model from Kuaishou, offering high-quality video creation with strong motion dynamics and cinematic capabilities.',
        features: ['Text-to-Video', 'Image-to-Video', 'Video Extension', 'Multi-subject', 'Cinematic Quality'],
        pricing: 'Credit-based',
        website: 'https://kling.ai',
        maxDuration: '2 minutes',
        quality: 'Excellent',
        avatar: '🌟',
        color: '#ff6b35'
    },
    {
        id: 'luma-dream',
        name: 'Dream Machine',
        provider: 'Luma AI',
        description: 'High-quality AI video generator known for exceptional motion quality and realistic physics simulation.',
        features: ['Text-to-Video', 'Image-to-Video', 'Camera Motion', 'Physics-accurate', 'Character Consistency'],
        pricing: 'Subscription',
        website: 'https://lumalabs.ai/dream-machine',
        maxDuration: '5 seconds (free), 120 seconds (pro)',
        quality: 'Excellent',
        avatar: '💫',
        color: '#4361ee'
    },
    {
        id: 'veo',
        name: 'Veo 3',
        provider: 'Google DeepMind',
        description: 'Google\'s latest video generation model with native audio generation and unparalleled understanding of visual physics.',
        features: ['Text-to-Video', 'Audio Generation', 'Physics Understanding', '4K Support', 'Extended Context'],
        pricing: 'Vertex AI',
        website: 'https://deepmind.google/technologies/veo',
        maxDuration: '8 seconds',
        quality: 'Excellent',
        avatar: '🔮',
        color: '#4285f4'
    },
    {
        id: 'minimax',
        name: 'Minimax Video',
        provider: 'MiniMax',
        description: 'Open-source AI video generation model offering impressive quality with strong performance in character animation and scene consistency.',
        features: ['Text-to-Video', 'Open Source', 'Character Animation', 'Scene Consistency', 'API Access'],
        pricing: 'Freemium',
        website: 'https://minimax.ai',
        maxDuration: '10 seconds',
        quality: 'Good',
        avatar: '🎭',
        color: '#06d6a0'
    },
    {
        id: 'stable-video',
        name: 'Stable Video Diffusion',
        provider: 'Stability AI',
        description: 'Open-source video generation based on image-to-video diffusion, providing controllable and consistent video generation.',
        features: ['Image-to-Video', 'Open Source', 'Controllable Motion', 'Local Deployment', 'API Access'],
        pricing: 'Free/Open Source',
        website: 'https://stability.ai/stable-video',
        maxDuration: '2-4 seconds',
        quality: 'Good',
        avatar: '🌀',
        color: '#ef476f'
    },
    {
        id: 'haiper',
        name: 'Haiper',
        provider: 'Haiper AI',
        description: 'User-friendly AI video generator with strong capabilities in transforming images to video and creative content generation.',
        features: ['Text-to-Video', 'Image-to-Video', 'Video Remixing', 'Style Transfer', '4K Output'],
        pricing: 'Freemium',
        website: 'https://haiper.ai',
        maxDuration: '8 seconds',
        quality: 'Good',
        avatar: '🌊',
        color: '#00b4d8'
    },
    {
        id: 'step-video',
        name: 'Step-Video',
        provider: 'StepFun',
        description: 'Open-source video generation model from StepFun, offering strong performance with efficient computation.',
        features: ['Text-to-Video', 'Open Source', 'Efficient', 'High Resolution', 'API Access'],
        pricing: 'Free/Open Source',
        website: 'https://stepfun.com',
        maxDuration: '6 seconds',
        quality: 'Good',
        avatar: '🚀',
        color: '#ffd60a'
    },
    {
        id: 'morphstudio',
        name: 'Morph Studio',
        provider: 'Morph Studio',
        description: 'AI-powered video creation platform focused on cinematic quality and professional-grade video generation.',
        features: ['Text-to-Video', 'Cinematic Quality', 'Camera Control', 'Story Mode', 'Professional Tools'],
        pricing: 'Subscription',
        website: 'https://morphstudio.com',
        maxDuration: 'Up to 30 seconds',
        quality: 'Very Good',
        avatar: '🎞️',
        color: '#8338ec'
    },
    {
        id: 'meta-moviegen',
        name: 'Movie Gen',
        provider: 'Meta AI',
        description: 'Meta\'s research video generation model capable of creating high-quality video from text with complex scene understanding.',
        features: ['Text-to-Video', 'Personalized Video', 'Audio Sync', 'Video Editing', 'Research Preview'],
        pricing: 'Research',
        website: 'https://ai.meta.com/movie-gen',
        maxDuration: '16 seconds',
        quality: 'Very Good',
        avatar: '🎬',
        color: '#0668e1'
    }
];

const AIVideoDirectoryPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');

    const providers = ['all', ...new Set(aiVideoModels.map(m => m.provider))];

    const filteredModels = aiVideoModels
        .filter(model => {
            const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                model.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
            return matchesSearch && matchesProvider;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'provider') return a.provider.localeCompare(b.provider);
            return 0;
        });

    return (
        <div className="space-y-8 animate-fadeIn w-full max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">AI Video Generation Models</h1>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Discover the best AI tools for video creation</p>
                </div>
            </div>

            {/* Search and Filter */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search models, features, providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-sidebar-bg/50 border border-border-color rounded-xl text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="px-4 py-3 bg-sidebar-bg/50 border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                        >
                            {providers.map(provider => (
                                <option key={provider} value={provider}>
                                    {provider === 'all' ? 'All Providers' : provider}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-sidebar-bg/50 border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="provider">Sort by Provider</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="text-2xl font-bold text-primary">{aiVideoModels.length}</div>
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Total Models</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-primary">{providers.length - 1}</div>
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Providers</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-primary">{filteredModels.length}</div>
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Showing Results</div>
                </Card>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model) => (
                    <Card key={model.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: `${model.color}20` }}
                                >
                                    {model.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-text-primary truncate">{model.name}</h3>
                                    <p className="text-sm font-semibold" style={{ color: model.color }}>{model.provider}</p>
                                </div>
                            </div>

                            <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                                {model.description}
                            </p>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-text-secondary">⏱️ Max Duration:</span>
                                    <span className="font-semibold text-text-primary">{model.maxDuration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-text-secondary">⭐ Quality:</span>
                                    <span className="font-semibold text-text-primary">{model.quality}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-text-secondary">💰 Pricing:</span>
                                    <span className="font-semibold text-text-primary">{model.pricing}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Features</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {model.features.slice(0, 4).map((feature, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-sidebar-bg border border-border-color text-text-primary"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                    {model.features.length > 4 && (
                                        <span className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-sidebar-bg border border-border-color text-text-secondary">
                                            +{model.features.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <a
                                href={model.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-2.5 px-4 text-center text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                            >
                                Visit Website →
                            </a>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredModels.length === 0 && (
                <Card className="p-12 text-center">
                    <p className="text-lg font-bold text-text-secondary">No models found matching your criteria</p>
                    <p className="text-sm text-text-secondary mt-2">Try adjusting your search or filters</p>
                </Card>
            )}

            {/* Footer Note */}
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <p className="text-sm text-text-secondary text-center">
                    <span className="font-bold">Note:</span> This directory is regularly updated as AI video generation technology evolves rapidly. 
                    Pricing, features, and availability may change. Please visit the respective websites for the most up-to-date information.
                </p>
            </Card>
        </div>
    );
};

export default AIVideoDirectoryPage;
