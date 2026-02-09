#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
图片压缩GUI工具
支持单图测试和批量压缩，智能目标大小压缩，安全预览机制
"""

import os
import sys
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from pathlib import Path
from PIL import Image, ImageTk
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import shutil

# 临时预览目录
TEMP_PREVIEW_DIR = "temp_preview"


class ComparisonPreviewWindow:
    """预览对比窗口 - 支持左右切换查看压缩效果"""
    
    def __init__(self, parent, file_list, current_index, main_app):
        """
        Args:
            parent: 父窗口（主窗口）
            file_list: 文件item_id列表
            current_index: 当前显示的索引
            main_app: 主程序引用（ImageCompressorGUI实例）
        """
        self.parent = parent
        self.file_list = file_list
        self.current_index = current_index
        self.main_app = main_app
        
        # 创建窗口
        self.window = tk.Toplevel(parent)
        self.window.title(f"预览对比 - {current_index + 1}/{len(file_list)}")
        self.window.geometry("1000x700")
        
        # 居中显示
        self.center_window()
        
        # 图片引用（防止被垃圾回收）
        self.original_photo = None
        self.compressed_photo = None
        
        # 设置UI
        self.setup_ui()
        
        # 加载当前文件
        self.show_current_file()
        
        # 绑定键盘事件
        self.window.bind('<Left>', lambda e: self.prev_file())
        self.window.bind('<Right>', lambda e: self.next_file())
        self.window.bind('<Escape>', lambda e: self.window.destroy())
        self.window.focus_set()
    
    def center_window(self):
        """窗口居中显示"""
        self.window.update_idletasks()
        width = self.window.winfo_width()
        height = self.window.winfo_height()
        x = (self.window.winfo_screenwidth() // 2) - (width // 2)
        y = (self.window.winfo_screenheight() // 2) - (height // 2)
        self.window.geometry(f'{width}x{height}+{x}+{y}')
    
    def setup_ui(self):
        """设置UI布局"""
        # 顶部：文件信息栏
        info_frame = ttk.Frame(self.window, padding="10")
        info_frame.pack(fill=tk.X)
        
        self.filename_label = ttk.Label(info_frame, text="", font=('Arial', 12, 'bold'))
        self.filename_label.pack(side=tk.LEFT)
        
        self.counter_label = ttk.Label(info_frame, text="", font=('Arial', 10))
        self.counter_label.pack(side=tk.RIGHT)
        
        # 中部：左右对比区域
        comparison_frame = ttk.Frame(self.window, padding="10")
        comparison_frame.pack(fill=tk.BOTH, expand=True)
        
        # 左侧：原图
        left_frame = ttk.LabelFrame(comparison_frame, text="原图", padding="10")
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        self.original_canvas = tk.Canvas(left_frame, bg='white')
        self.original_canvas.pack(fill=tk.BOTH, expand=True)
        
        self.original_info_label = ttk.Label(left_frame, text="", font=('Arial', 10))
        self.original_info_label.pack(pady=5)
        
        # 右侧：压缩后
        right_frame = ttk.LabelFrame(comparison_frame, text="压缩后", padding="10")
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5)
        
        self.compressed_canvas = tk.Canvas(right_frame, bg='white')
        self.compressed_canvas.pack(fill=tk.BOTH, expand=True)
        
        self.compressed_info_label = ttk.Label(right_frame, text="", font=('Arial', 10))
        self.compressed_info_label.pack(pady=5)
        
        # 详细信息区域
        detail_frame = ttk.Frame(self.window, padding="10")
        detail_frame.pack(fill=tk.X)
        
        self.detail_label = ttk.Label(detail_frame, text="", font=('Arial', 10), justify=tk.LEFT)
        self.detail_label.pack()
        
        # 底部：控制按钮栏
        control_frame = ttk.Frame(self.window, padding="10")
        control_frame.pack(fill=tk.X)
        
        self.prev_button = ttk.Button(control_frame, text="← 上一张 (Left)", command=self.prev_file)
        self.prev_button.pack(side=tk.LEFT, padx=5)
        
        ttk.Button(control_frame, text="关闭 (ESC)", command=self.window.destroy).pack(side=tk.LEFT, padx=5)
        
        ttk.Label(control_frame, text="快捷键: ← → 切换, ESC 关闭", 
                 font=('Arial', 9, 'italic')).pack(side=tk.LEFT, padx=20)
        
        self.next_button = ttk.Button(control_frame, text="下一张 → (Right)", command=self.next_file)
        self.next_button.pack(side=tk.RIGHT, padx=5)
    
    def show_current_file(self):
        """显示当前索引的文件对比"""
        if not (0 <= self.current_index < len(self.file_list)):
            return
        
        item_id = self.file_list[self.current_index]
        file_data = self.main_app.batch_files_data.get(item_id)
        
        if not file_data:
            return
        
        # 获取文件信息
        original_path = file_data['path']
        preview_file = file_data.get('preview_file')
        original_size = file_data['original_size']
        compressed_size = file_data['compressed_size']
        compression_info = file_data.get('compression_info', {})
        
        # 更新标题和计数
        self.window.title(f"预览对比 - {self.current_index + 1}/{len(self.file_list)}")
        self.filename_label.config(text=original_path.name)
        self.counter_label.config(text=f"{self.current_index + 1} / {len(self.file_list)}")
        
        # 加载并显示原图
        self.load_and_display_image(original_path, self.original_canvas, is_original=True)
        self.original_info_label.config(
            text=f"大小: {self.main_app.format_bytes(original_size)}\n"
                 f"尺寸: {self.get_image_dimensions(original_path)}"
        )
        
        # 加载并显示压缩后图片
        if preview_file and preview_file.exists():
            self.load_and_display_image(preview_file, self.compressed_canvas, is_original=False)
            self.compressed_info_label.config(
                text=f"大小: {self.main_app.format_bytes(compressed_size)}\n"
                     f"尺寸: {self.get_image_dimensions(preview_file)}"
            )
        else:
            self.compressed_info_label.config(text="预览文件不存在")
        
        # 显示详细信息
        reduction = file_data.get('reduction', 0)
        method = compression_info.get('method', 'Unknown')
        quality = compression_info.get('quality')
        compress_level = compression_info.get('compress_level')
        target_reached = compression_info.get('target_reached', False)
        
        # 格式化质量参数
        quality_str = self.main_app._format_quality_display(compression_info)
        status_str = self.main_app._format_status_display(compression_info, compressed_size)
        
        detail_text = (
            f"原始: {self.main_app.format_bytes(original_size)}  |  "
            f"压缩后: {self.main_app.format_bytes(compressed_size)}  |  "
            f"节省: {reduction:.1f}%  |  "
            f"质量: {quality_str}  |  "
            f"状态: {status_str}"
        )
        self.detail_label.config(text=detail_text)
        
        # 更新按钮状态
        self.update_button_states()
        
        # 同步主窗口选中
        self.sync_main_list()
    
    def load_and_display_image(self, image_path, canvas, is_original=True):
        """加载并在Canvas上显示图片（自适应大小）"""
        try:
            img = Image.open(image_path)
            
            # 获取Canvas尺寸
            canvas.update()
            canvas_width = canvas.winfo_width()
            canvas_height = canvas.winfo_height()
            
            if canvas_width <= 1:
                canvas_width = 400
            if canvas_height <= 1:
                canvas_height = 400
            
            # 计算缩放比例（保持宽高比）
            img_width, img_height = img.size
            scale = min(canvas_width / img_width, canvas_height / img_height)
            
            if scale < 1:  # 只有图片太大时才缩放
                new_width = int(img_width * scale * 0.9)  # 留一点边距
                new_height = int(img_height * scale * 0.9)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # 转换为PhotoImage
            photo = ImageTk.PhotoImage(img)
            
            # 保存引用
            if is_original:
                self.original_photo = photo
            else:
                self.compressed_photo = photo
            
            # 清空并显示
            canvas.delete("all")
            canvas.create_image(canvas_width // 2, canvas_height // 2, image=photo)
            
        except Exception as e:
            print(f"加载图片失败: {image_path} - {e}")
            canvas.delete("all")
            canvas.create_text(canvas_width // 2, canvas_height // 2, 
                              text=f"加载失败\n{str(e)}", fill='red')
    
    def get_image_dimensions(self, image_path):
        """获取图片尺寸"""
        try:
            img = Image.open(image_path)
            return f"{img.size[0]} x {img.size[1]}"
        except:
            return "未知"
    
    def next_file(self):
        """下一张"""
        if self.current_index < len(self.file_list) - 1:
            self.current_index += 1
            self.show_current_file()
    
    def prev_file(self):
        """上一张"""
        if self.current_index > 0:
            self.current_index -= 1
            self.show_current_file()
    
    def update_button_states(self):
        """更新按钮启用/禁用状态"""
        # 禁用边界外的按钮
        if self.current_index <= 0:
            self.prev_button.config(state='disabled')
        else:
            self.prev_button.config(state='normal')
        
        if self.current_index >= len(self.file_list) - 1:
            self.next_button.config(state='disabled')
        else:
            self.next_button.config(state='normal')
    
    def sync_main_list(self):
        """同步主窗口列表选中状态"""
        item_id = self.file_list[self.current_index]
        
        # 更新选中
        self.main_app.batch_tree.selection_set(item_id)
        
        # 滚动到可见区域
        self.main_app.batch_tree.see(item_id)


class ImageCompressorGUI:
    """图片压缩GUI主程序"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("🖼️ 图片压缩工具")
        self.root.geometry("1200x700")
        
        # 设置窗口图标（如果有的话）
        try:
            # self.root.iconbitmap('icon.ico')
            pass
        except:
            pass
        
        # 创建临时预览目录
        os.makedirs(TEMP_PREVIEW_DIR, exist_ok=True)
        
        # 初始化变量
        self.init_variables()
        
        # 创建菜单栏
        self.create_menu()
        
        # 创建主界面
        self.create_widgets()
        
        # 绑定窗口关闭事件
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def init_variables(self):
        """初始化变量"""
        # 压缩参数
        self.target_size_kb = tk.IntVar(value=1536)  # 目标大小（KB）- 1.5MB
        self.jpg_quality = tk.IntVar(value=85)  # JPG质量
        self.png_quality = tk.IntVar(value=90)  # PNG质量（仅显示用）
        self.max_workers = tk.IntVar(value=20)  # 线程数
        self.preserve_alpha = tk.BooleanVar(value=True)  # 保留透明通道（默认勾选）
        self.min_size_mb = tk.DoubleVar(value=1.5)  # 批量压缩时的最小文件大小阈值 - 1.5MB
        
        # 压缩模式：按质量 or 按目标大小
        self.compress_mode = tk.StringVar(value="target_size")  # "quality" or "target_size"
        
        # 当前选择的文件/目录
        self.current_file = None
        self.current_dir = None
        
        # 图片对象
        self.original_image = None
        self.compressed_image = None
        self.original_photo = None
        self.compressed_photo = None
        
        # 批量预览相关
        self.batch_files_data = {}  # 存储文件数据：{item_id: {path, original_size, compressed_size, preview_file, checked}}
    
    def create_menu(self):
        """创建菜单栏"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # 文件菜单
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="文件", menu=file_menu)
        file_menu.add_command(label="打开图片", command=self.select_single_file)
        file_menu.add_command(label="选择目录", command=self.select_directory)
        file_menu.add_separator()
        file_menu.add_command(label="清理临时文件", command=self.clean_temp_files)
        file_menu.add_separator()
        file_menu.add_command(label="退出", command=self.on_closing)
        
        # 帮助菜单
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="帮助", menu=help_menu)
        help_menu.add_command(label="使用说明", command=self.show_help)
        help_menu.add_command(label="关于", command=self.show_about)
    
    def create_widgets(self):
        """创建主界面控件"""
        # 创建主容器
        main_container = ttk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 创建标签页
        self.notebook = ttk.Notebook(main_container)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # 单图测试标签页
        self.single_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.single_frame, text="  单图测试  ")
        self.create_single_test_tab()
        
        # 批量压缩标签页
        self.batch_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.batch_frame, text="  批量压缩  ")
        self.create_batch_compress_tab()
    
    def create_single_test_tab(self):
        """创建单图测试标签页"""
        # 左右分栏
        left_frame = ttk.Frame(self.single_frame, width=300)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=5, pady=5)
        left_frame.pack_propagate(False)
        
        right_frame = ttk.Frame(self.single_frame)
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 左侧参数面板
        self.create_param_panel(left_frame, mode='single')
        
        # 右侧图片对比区域
        self.create_image_comparison_panel(right_frame)
    
    def create_batch_compress_tab(self):
        """创建批量压缩标签页"""
        # 左右分栏
        left_frame = ttk.Frame(self.batch_frame, width=300)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=5, pady=5)
        left_frame.pack_propagate(False)
        
        right_frame = ttk.Frame(self.batch_frame)
        right_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 左侧参数面板
        self.create_param_panel(left_frame, mode='batch')
        
        # 右侧文件列表和进度区域
        self.create_batch_panel(right_frame)
    
    def create_param_panel(self, parent, mode='single'):
        """创建参数配置面板
        Args:
            parent: 父容器
            mode: 'single' 或 'batch'
        """
        # 文件选择区域
        ttk.Label(parent, text="📁 文件选择", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
        
        if mode == 'single':
            ttk.Button(parent, text="选择图片文件", command=self.select_single_file).pack(fill=tk.X, pady=5)
        else:
            ttk.Button(parent, text="选择图片目录", command=self.select_directory).pack(fill=tk.X, pady=5)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 压缩模式选择
        ttk.Label(parent, text="🎯 压缩模式", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
        
        mode_frame = ttk.Frame(parent)
        mode_frame.pack(fill=tk.X, pady=5)
        
        ttk.Radiobutton(
            mode_frame, 
            text="按目标大小", 
            variable=self.compress_mode, 
            value="target_size"
        ).pack(anchor=tk.W)
        
        ttk.Radiobutton(
            mode_frame, 
            text="按质量参数", 
            variable=self.compress_mode, 
            value="quality"
        ).pack(anchor=tk.W)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 目标大小设置
        ttk.Label(parent, text="📏 目标大小 (KB)", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
        
        target_frame = ttk.Frame(parent)
        target_frame.pack(fill=tk.X, pady=5)
        
        ttk.Entry(target_frame, textvariable=self.target_size_kb, width=10).pack(side=tk.LEFT)
        ttk.Label(target_frame, text=" KB").pack(side=tk.LEFT)
        
        # 快捷按钮
        quick_frame = ttk.Frame(parent)
        quick_frame.pack(fill=tk.X, pady=5)
        
        ttk.Button(quick_frame, text="500KB", width=7, 
                   command=lambda: self.target_size_kb.set(500)).pack(side=tk.LEFT, padx=2)
        ttk.Button(quick_frame, text="1MB", width=7,
                   command=lambda: self.target_size_kb.set(1000)).pack(side=tk.LEFT, padx=2)
        ttk.Button(quick_frame, text="2MB", width=7,
                   command=lambda: self.target_size_kb.set(2000)).pack(side=tk.LEFT, padx=2)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 质量参数设置
        ttk.Label(parent, text="🎨 质量参数", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
        
        # JPG质量
        jpg_frame = ttk.Frame(parent)
        jpg_frame.pack(fill=tk.X, pady=3)
        ttk.Label(jpg_frame, text="JPG质量:", width=10).pack(side=tk.LEFT)
        ttk.Scale(jpg_frame, from_=10, to=100, variable=self.jpg_quality, 
                  orient=tk.HORIZONTAL).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        ttk.Label(jpg_frame, textvariable=self.jpg_quality, width=4).pack(side=tk.LEFT)
        
        # PNG质量
        png_frame = ttk.Frame(parent)
        png_frame.pack(fill=tk.X, pady=3)
        ttk.Label(png_frame, text="PNG质量:", width=10).pack(side=tk.LEFT)
        ttk.Scale(png_frame, from_=10, to=100, variable=self.png_quality,
                  orient=tk.HORIZONTAL).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        ttk.Label(png_frame, textvariable=self.png_quality, width=4).pack(side=tk.LEFT)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 高级选项
        ttk.Label(parent, text="⚙️ 高级选项", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
        
        # 透明通道保留（默认勾选）
        preserve_frame = ttk.Frame(parent)
        preserve_frame.pack(fill=tk.X, pady=3)
        ttk.Checkbutton(
            preserve_frame,
            text="保留透明通道",
            variable=self.preserve_alpha
        ).pack(anchor=tk.W)
        ttk.Label(preserve_frame, text="  (PNG透明效果)", 
                  font=('Arial', 8), foreground='gray').pack(anchor=tk.W, padx=20)
        
        # 线程数
        if mode == 'batch':
            thread_frame = ttk.Frame(parent)
            thread_frame.pack(fill=tk.X, pady=3)
            ttk.Label(thread_frame, text="并发线程:", width=10).pack(side=tk.LEFT)
            ttk.Spinbox(thread_frame, from_=1, to=50, textvariable=self.max_workers,
                        width=8).pack(side=tk.LEFT)
            
            # 文件大小阈值
            ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
            ttk.Label(parent, text="📊 筛选条件", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
            
            size_frame = ttk.Frame(parent)
            size_frame.pack(fill=tk.X, pady=3)
            ttk.Label(size_frame, text="最小大小:", width=10).pack(side=tk.LEFT)
            ttk.Entry(size_frame, textvariable=self.min_size_mb, width=8).pack(side=tk.LEFT)
            ttk.Label(size_frame, text=" MB").pack(side=tk.LEFT)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 预设方案
        ttk.Label(parent, text="📋 预设方案", font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 5))
        
        preset_frame = ttk.Frame(parent)
        preset_frame.pack(fill=tk.X, pady=5)
        
        ttk.Button(preset_frame, text="微信分享", 
                   command=lambda: self.apply_preset('wechat')).pack(fill=tk.X, pady=2)
        ttk.Button(preset_frame, text="网页优化",
                   command=lambda: self.apply_preset('web')).pack(fill=tk.X, pady=2)
        ttk.Button(preset_frame, text="文档用图",
                   command=lambda: self.apply_preset('document')).pack(fill=tk.X, pady=2)
        ttk.Button(preset_frame, text="高质量保存",
                   command=lambda: self.apply_preset('high_quality')).pack(fill=tk.X, pady=2)
        
        ttk.Separator(parent, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # 操作按钮
        if mode == 'single':
            ttk.Button(parent, text="🚀 开始压缩", 
                       command=self.compress_single_image).pack(fill=tk.X, pady=5)
        else:
            # 批量模式按钮
            ttk.Button(parent, text="� 预览扫描", 
                       command=self.preview_batch_compress).pack(fill=tk.X, pady=5)
            ttk.Button(parent, text="�🚀 开始批量压缩",
                       command=self.start_batch_compress).pack(fill=tk.X, pady=5)
    
    def apply_preset(self, preset_name):
        """应用预设方案"""
        presets = {
            'wechat': {
                'mode': 'target_size',
                'target_size': 500,
                'jpg_quality': 80,
                'png_quality': 85,
                'desc': '微信分享 (500KB)'
            },
            'web': {
                'mode': 'target_size',
                'target_size': 200,
                'jpg_quality': 75,
                'png_quality': 80,
                'desc': '网页优化 (200KB)'
            },
            'document': {
                'mode': 'target_size',
                'target_size': 1000,
                'jpg_quality': 85,
                'png_quality': 90,
                'desc': '文档用图 (1MB)'
            },
            'high_quality': {
                'mode': 'quality',
                'target_size': 2000,
                'jpg_quality': 92,
                'png_quality': 95,
                'desc': '高质量保存'
            }
        }
        
        if preset_name in presets:
            preset = presets[preset_name]
            self.compress_mode.set(preset['mode'])
            self.target_size_kb.set(preset['target_size'])
            self.jpg_quality.set(preset['jpg_quality'])
            self.png_quality.set(preset['png_quality'])
            messagebox.showinfo("预设应用", f"已应用预设：{preset['desc']}")
    
    def format_bytes(self, bytes_num):
        """格式化字节数"""
        if bytes_num < 1024:
            return f"{bytes_num} B"
        elif bytes_num < 1024 * 1024:
            return f"{bytes_num / 1024:.1f} KB"
        else:
            return f"{bytes_num / (1024 * 1024):.2f} MB"
    
    def has_real_alpha(self, img):
        """检查PNG是否有真实的透明通道
        
        Args:
            img: PIL Image对象
            
        Returns:
            True如果有真实透明，False如果没有或全不透明
        """
        if img.mode != 'RGBA':
            return False
        
        # 获取alpha通道
        alpha = img.getchannel('A')
        extrema = alpha.getextrema()
        
        # 如果alpha通道全是255（完全不透明），则没有真实透明
        if extrema == (255, 255):
            return False
        
        # 有真实的透明效果
        return True
    
    def compress_png_aggressive(self, image_path, output_path, target_size_bytes):
        """激进的PNG压缩策略 - 尝试所有compress_level
        
        Args:
            image_path: 原图路径
            output_path: 输出路径
            target_size_bytes: 目标大小（字节）
            
        Returns:
            (实际大小, compress_level, 是否达到目标)
        """
        img = Image.open(image_path)
        
        # 从最高压缩级别开始尝试
        best_size = float('inf')
        best_level = 9
        
        for compress_level in [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]:
            try:
                # 尝试这个压缩级别
                img.save(output_path, 'PNG', optimize=True, compress_level=compress_level)
                actual_size = output_path.stat().st_size
                
                # 记录最小的结果
                if actual_size < best_size:
                    best_size = actual_size
                    best_level = compress_level
                
                # 如果达到目标，立即返回
                if actual_size <= target_size_bytes:
                    return (actual_size, compress_level, True)
                    
            except Exception as e:
                print(f"PNG compress_level {compress_level} 失败: {e}")
                continue
        
        # 无法达到目标，返回最小结果（使用best_level重新保存）
        img.save(output_path, 'PNG', optimize=True, compress_level=best_level)
        final_size = output_path.stat().st_size
        return (final_size, best_level, False)
    
    def convert_png_to_jpg_aggressive(self, image_path, output_path, target_size_bytes):
        """将PNG转换为JPG并尝试达到目标大小
        
        Args:
            image_path: 原图路径（PNG）
            output_path: 输出路径（将被改为.jpg）
            target_size_bytes: 目标大小（字节）
            
        Returns:
            (实际大小, quality, 是否达到目标, 实际输出路径)
        """
        img = Image.open(image_path)
        
        # 转换为RGB（去除透明通道）
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')
        
        # 修改输出路径为.jpg
        jpg_output = output_path.with_suffix('.jpg')
        
        # 从高到低尝试不同质量
        best_size = float('inf')
        best_quality = 10
        
        for quality in [95, 85, 75, 65, 55, 45, 35, 25, 15, 10]:
            try:
                img.save(jpg_output, 'JPEG', quality=quality, optimize=True, progressive=True)
                actual_size = jpg_output.stat().st_size
                
                # 记录最小的结果
                if actual_size < best_size:
                    best_size = actual_size
                    best_quality = quality
                
                # 如果达到目标，立即返回
                if actual_size <= target_size_bytes:
                    return (actual_size, quality, True, jpg_output)
                    
            except Exception as e:
                print(f"JPG quality {quality} 失败: {e}")
                continue
        
        # 无法达到目标，返回最小结果（使用best_quality重新保存）
        img.save(jpg_output, 'JPEG', quality=best_quality, optimize=True, progressive=True)
        final_size = jpg_output.stat().st_size
        return (final_size, best_quality, False, jpg_output)
    
    def compress_image_with_quality(self, image_path, output_path, quality, preserve_alpha=True):
        """使用指定质量参数压缩图片
        
        Args:
            image_path: 原图路径
            output_path: 输出路径
            quality: 压缩质量(10-100)
            preserve_alpha: 是否保留透明通道
            
        Returns:
            压缩后的文件大小（字节）
        """
        try:
            img = Image.open(image_path)
            ext = image_path.suffix.lower()
            
            if ext in ['.jpg', '.jpeg']:
                # JPG处理
                if img.mode == 'RGBA':
                    if not preserve_alpha:
                        # 不保留透明通道，使用白色背景
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[3])
                        img = background
                    else:
                        # 保留透明通道但JPG不支持，转为白色背景
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[3])
                        img = background
                elif img.mode not in ('RGB', 'L'):
                    img = img.convert('RGB')
                
                # 保存JPG
                img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
            
            elif ext == '.png':
                # PNG处理
                if not preserve_alpha and img.mode == 'RGBA':
                    # 不保留透明通道，转换为RGB
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background
                    # 保存为JPG格式（更小）
                    output_path = output_path.with_suffix('.jpg')
                    img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
                else:
                    # 保留透明通道或原本就是RGB
                    # PNG的quality参数映射到compress_level (0-9)
                    compress_level = int((100 - quality) / 11)  # 质量越低，压缩级别越高
                    compress_level = max(0, min(9, compress_level))
                    img.save(output_path, 'PNG', optimize=True, compress_level=compress_level)
            
            # 返回文件大小
            return output_path.stat().st_size
            
        except Exception as e:
            raise Exception(f"压缩失败：{str(e)}")
    
    def find_optimal_quality(self, image_path, target_size_kb, preserve_alpha=True, force_jpg=False):
        """智能压缩 - 自动选择最优策略达到目标大小
        
        Args:
            image_path: 图片路径
            target_size_kb: 目标大小（KB）
            preserve_alpha: 是否保留透明通道
            force_jpg: 是否强制使用JPG格式（用于PNG→JPG转换）
            
        Returns:
            (最优质量/level, 实际大小KB, 临时文件路径, compression_info)
        """
        target_size_bytes = target_size_kb * 1024
        final_temp_file = Path(TEMP_PREVIEW_DIR) / f"preview_{image_path.name}"
        ext = image_path.suffix.lower()
        
        # 如果强制JPG，直接用 .jpg 路径，避免和之前的 .png 预览文件冲突
        if force_jpg and ext == '.png':
            jpg_temp_file = final_temp_file.with_suffix('.jpg')
            # 清理之前可能存在的 .png 预览文件
            if final_temp_file.exists():
                final_temp_file.unlink()
            return self._compress_jpg_binary_search(image_path, jpg_temp_file, target_size_bytes)
        
        # 根据文件类型选择策略
        if ext in ['.jpg', '.jpeg']:
            # JPG文件：使用二分查找
            return self._compress_jpg_binary_search(image_path, final_temp_file, target_size_bytes)
        
        elif ext == '.png':
            # PNG文件：使用激进策略
            return self._compress_png_smart(image_path, final_temp_file, target_size_bytes, preserve_alpha)
        
        else:
            # 其他格式，按JPG处理
            return self._compress_jpg_binary_search(image_path, final_temp_file, target_size_bytes)
    
    def _save_as_jpg(self, image_path, output_path, quality):
        """将任意图片以JPG格式保存到指定路径
        
        Args:
            image_path: 原图路径
            output_path: 输出路径（会强制保存为JPG格式，不管扩展名）
            quality: JPG质量(10-100)
            
        Returns:
            实际文件大小（字节）
        """
        img = Image.open(image_path)
        
        # 确保转换为RGB
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')
        
        # 直接以JPEG格式保存（不管output_path的扩展名是什么）
        img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
        return output_path.stat().st_size
    
    def _compress_jpg_binary_search(self, image_path, output_path, target_size_bytes):
        """JPG二分查找压缩（直接以JPG格式保存，不依赖扩展名判断）
        
        Returns:
            (quality, size_kb, output_path, compression_info)
        """
        temp_file = Path(TEMP_PREVIEW_DIR) / f"test_{image_path.stem}.jpg"
        
        low, high = 10, 95
        best_quality = 85
        best_size = 0
        tolerance = 50 * 1024  # 50KB容忍度
        
        # 二分查找
        for attempt in range(10):
            mid = (low + high) // 2
            
            try:
                compressed_size = self._save_as_jpg(image_path, temp_file, mid)
                
                size_diff = abs(compressed_size - target_size_bytes)
                
                if size_diff < tolerance:
                    best_quality = mid
                    best_size = compressed_size
                    break
                
                if compressed_size > target_size_bytes:
                    high = mid - 1
                else:
                    best_quality = mid
                    best_size = compressed_size
                    low = mid + 1
                    
            except Exception as e:
                print(f"JPG quality {mid} 测试失败: {e}")
                break
        
        # 如果没有找到满足的，尝试最低质量
        if best_size == 0 or best_size > target_size_bytes:
            try:
                best_size = self._save_as_jpg(image_path, temp_file, 10)
                best_quality = 10
            except:
                pass
        
        # 生成最终文件
        try:
            final_size = self._save_as_jpg(image_path, output_path, best_quality)
        except:
            final_size = best_size
        
        # 清理测试文件
        if temp_file.exists():
            temp_file.unlink()
        
        # 构建compression_info
        target_reached = final_size <= target_size_bytes
        original_size = image_path.stat().st_size
        reduction = (1 - final_size / original_size) * 100 if original_size > 0 else 0
        
        compression_info = {
            'method': 'JPG',
            'quality': best_quality,
            'compress_level': None,
            'target_reached': target_reached,
            'actual_size': final_size,
            'reduction': reduction
        }
        
        return best_quality, final_size / 1024, output_path, compression_info
    
    def _compress_png_smart(self, image_path, output_path, target_size_bytes, preserve_alpha):
        """PNG智能压缩策略
        
        Returns:
            (quality_or_level, size_kb, output_path, compression_info)
        """
        original_size = image_path.stat().st_size
        
        # 步骤1：尝试PNG压缩
        png_size, png_level, png_reached = self.compress_png_aggressive(
            image_path, output_path, target_size_bytes
        )
        
        # 如果PNG达到目标，直接返回
        if png_reached:
            reduction = (1 - png_size / original_size) * 100 if original_size > 0 else 0
            compression_info = {
                'method': 'PNG',
                'quality': None,
                'compress_level': png_level,
                'target_reached': True,
                'actual_size': png_size,
                'reduction': reduction
            }
            return png_level, png_size / 1024, output_path, compression_info
        
        # 步骤2：PNG无法达到目标，检查是否可以转JPG
        # 条件：1. 不保留透明通道 或 2. 图片实际没有透明
        img = Image.open(image_path)
        has_alpha = self.has_real_alpha(img)
        
        # 如果preserve_alpha=True 且 有真实透明，则不能转JPG
        if preserve_alpha and has_alpha:
            # 只能返回PNG最小结果
            reduction = (1 - png_size / original_size) * 100 if original_size > 0 else 0
            compression_info = {
                'method': 'PNG',
                'quality': None,
                'compress_level': png_level,
                'target_reached': False,
                'actual_size': png_size,
                'reduction': reduction,
                'note': '有透明通道，无法进一步压缩'
            }
            return png_level, png_size / 1024, output_path, compression_info
        
        # 步骤3：尝试转JPG压缩
        jpg_size, jpg_quality, jpg_reached, jpg_output = self.convert_png_to_jpg_aggressive(
            image_path, output_path, target_size_bytes
        )
        
        # 如果JPG达到目标，使用JPG结果
        if jpg_reached or jpg_size < png_size:
            # 删除多余的PNG预览文件，只保留JPG版本
            if output_path.exists() and output_path != jpg_output:
                output_path.unlink()
            reduction = (1 - jpg_size / original_size) * 100 if original_size > 0 else 0
            compression_info = {
                'method': 'PNG→JPG',
                'quality': jpg_quality,
                'compress_level': None,
                'target_reached': jpg_reached,
                'actual_size': jpg_size,
                'reduction': reduction,
                'preserve_alpha': preserve_alpha,
                'has_real_alpha': has_alpha
            }
            return jpg_quality, jpg_size / 1024, jpg_output, compression_info
        
        # 步骤4：JPG也不理想，比较PNG和JPG，选择更小的
        if jpg_size < png_size:
            # 删除多余的PNG预览文件，只保留JPG版本
            if output_path.exists() and output_path != jpg_output:
                output_path.unlink()
            reduction = (1 - jpg_size / original_size) * 100 if original_size > 0 else 0
            compression_info = {
                'method': 'PNG→JPG',
                'quality': jpg_quality,
                'compress_level': None,
                'target_reached': False,
                'actual_size': jpg_size,
                'reduction': reduction,
                'preserve_alpha': preserve_alpha,
                'has_real_alpha': has_alpha
            }
            return jpg_quality, jpg_size / 1024, jpg_output, compression_info
        else:
            # PNG更小，使用PNG结果，删除多余的JPG预览文件
            if jpg_output.exists() and jpg_output != output_path:
                jpg_output.unlink()
            reduction = (1 - png_size / original_size) * 100 if original_size > 0 else 0
            compression_info = {
                'method': 'PNG',
                'quality': None,
                'compress_level': png_level,
                'target_reached': False,
                'actual_size': png_size,
                'reduction': reduction
            }
            return png_level, png_size / 1024, output_path, compression_info
    
    def create_image_comparison_panel(self, parent):
        """创建图片对比显示面板"""
        # 顶部信息栏
        info_frame = ttk.Frame(parent)
        info_frame.pack(fill=tk.X, pady=(0, 5))
        
        self.info_label = ttk.Label(
            info_frame,
            text="请选择图片并开始压缩",
            font=('Arial', 10),
            foreground='gray'
        )
        self.info_label.pack()
        
        # 图片对比容器
        comparison_frame = ttk.Frame(parent)
        comparison_frame.pack(fill=tk.BOTH, expand=True)
        
        # 原图区域
        original_container = ttk.Frame(comparison_frame)
        original_container.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        
        ttk.Label(original_container, text="原图", font=('Arial', 10, 'bold')).pack(pady=5)
        
        self.original_canvas = tk.Canvas(original_container, bg='#f0f0f0', highlightthickness=1)
        self.original_canvas.pack(fill=tk.BOTH, expand=True)
        
        self.original_info_label = ttk.Label(
            original_container,
            text="",
            font=('Arial', 9),
            foreground='gray'
        )
        self.original_info_label.pack(pady=5)
        
        # 压缩后区域
        compressed_container = ttk.Frame(comparison_frame)
        compressed_container.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(5, 0))
        
        ttk.Label(compressed_container, text="压缩后", font=('Arial', 10, 'bold')).pack(pady=5)
        
        self.compressed_canvas = tk.Canvas(compressed_container, bg='#f0f0f0', highlightthickness=1)
        self.compressed_canvas.pack(fill=tk.BOTH, expand=True)
        
        self.compressed_info_label = ttk.Label(
            compressed_container,
            text="",
            font=('Arial', 9),
            foreground='gray'
        )
        self.compressed_info_label.pack(pady=5)
        
        # 底部按钮栏
        button_frame = ttk.Frame(parent)
        button_frame.pack(fill=tk.X, pady=(10, 0))
        
        ttk.Button(
            button_frame,
            text="✓ 应用到原图",
            command=self.apply_compression
        ).pack(side=tk.LEFT, padx=5)
        
        ttk.Button(
            button_frame,
            text="✗ 取消",
            command=self.cancel_compression
        ).pack(side=tk.LEFT, padx=5)
        
        ttk.Button(
            button_frame,
            text="📁 打开临时目录",
            command=self.open_temp_directory
        ).pack(side=tk.RIGHT, padx=5)
    
    def display_images(self, original_path, compressed_path):
        """显示原图和压缩后的图片
        
        Args:
            original_path: 原图路径
            compressed_path: 压缩后图片路径
        """
        try:
            # 加载图片
            original_img = Image.open(original_path)
            compressed_img = Image.open(compressed_path)
            
            # 保存引用
            self.original_image_path = original_path
            self.compressed_image_path = compressed_path
            
            # 获取Canvas尺寸
            self.original_canvas.update()
            canvas_width = self.original_canvas.winfo_width()
            canvas_height = self.original_canvas.winfo_height()
            
            # 如果Canvas尺寸太小，使用默认值
            if canvas_width < 100:
                canvas_width = 400
            if canvas_height < 100:
                canvas_height = 400
            
            # 调整图片大小以适应Canvas
            original_resized = self.resize_image_to_fit(original_img, canvas_width, canvas_height)
            compressed_resized = self.resize_image_to_fit(compressed_img, canvas_width, canvas_height)
            
            # 转换为PhotoImage
            self.original_photo = ImageTk.PhotoImage(original_resized)
            self.compressed_photo = ImageTk.PhotoImage(compressed_resized)
            
            # 清空Canvas
            self.original_canvas.delete("all")
            self.compressed_canvas.delete("all")
            
            # 显示图片（居中）
            self.original_canvas.create_image(
                canvas_width // 2,
                canvas_height // 2,
                image=self.original_photo,
                anchor=tk.CENTER
            )
            
            self.compressed_canvas.create_image(
                canvas_width // 2,
                canvas_height // 2,
                image=self.compressed_photo,
                anchor=tk.CENTER
            )
            
            # 更新信息标签
            original_size = Path(original_path).stat().st_size
            compressed_size = Path(compressed_path).stat().st_size
            reduction = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0
            
            self.original_info_label.config(
                text=f"{original_img.size[0]} × {original_img.size[1]} | {self.format_bytes(original_size)}"
            )
            
            self.compressed_info_label.config(
                text=f"{compressed_img.size[0]} × {compressed_img.size[1]} | {self.format_bytes(compressed_size)} | 节省 {reduction:.1f}%"
            )
            
            self.info_label.config(
                text=f"压缩完成！原始 {self.format_bytes(original_size)} → 压缩后 {self.format_bytes(compressed_size)} (节省 {reduction:.1f}%)",
                foreground='green'
            )
            
        except Exception as e:
            messagebox.showerror("错误", f"显示图片失败：{str(e)}")
    
    def resize_image_to_fit(self, img, max_width, max_height):
        """调整图片大小以适应显示区域
        
        Args:
            img: PIL Image对象
            max_width: 最大宽度
            max_height: 最大高度
            
        Returns:
            调整后的PIL Image对象
        """
        # 获取原始尺寸
        orig_width, orig_height = img.size
        
        # 计算缩放比例
        width_ratio = max_width / orig_width
        height_ratio = max_height / orig_height
        ratio = min(width_ratio, height_ratio, 1.0)  # 不放大，只缩小
        
        # 计算新尺寸
        new_width = int(orig_width * ratio)
        new_height = int(orig_height * ratio)
        
        # 调整大小
        if ratio < 1.0:
            return img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        return img
    
    def apply_compression(self):
        """应用压缩（覆盖原图）"""
        if not hasattr(self, 'compressed_image_path') or not self.compressed_image_path:
            messagebox.showwarning("提示", "没有可应用的压缩结果！")
            return
        
        if not self.current_file:
            messagebox.showwarning("提示", "找不到原图文件！")
            return
        
        compressed_path = Path(self.compressed_image_path)
        original_path = Path(self.current_file)
        
        # 如果压缩文件不存在，尝试查找同名不同扩展名的文件
        if not compressed_path.exists():
            stem = compressed_path.stem
            parent = compressed_path.parent
            for ext in ['.jpg', '.jpeg', '.png', '.webp']:
                candidate = parent / f"{stem}{ext}"
                if candidate.exists() and candidate.is_file():
                    compressed_path = candidate
                    break
        
        if not compressed_path.exists():
            messagebox.showwarning("提示", "压缩后的预览文件不存在！")
            return
        
        # 确认操作 - 直接覆盖原文件（保持文件名不变）
        format_changed = compressed_path.suffix.lower() != original_path.suffix.lower()
        if format_changed:
            confirm_msg = (
                f"压缩后的图片将直接覆盖原文件。\n"
                f"（{compressed_path.suffix} 内容 → {original_path.name}，文件名不变）\n\n"
                "此操作不可撤销！确定要应用吗？"
            )
        else:
            confirm_msg = "确定要用压缩后的图片覆盖原图吗？\n此操作不可撤销！"
        
        if not messagebox.askyesno("确认", confirm_msg):
            return
        
        try:
            # 直接覆盖原文件路径（保持文件名不变）
            # PNG→JPG 时：JPG内容覆盖到 .png 文件名上，浏览器根据文件头识别格式，显示正常
            shutil.copy2(compressed_path, original_path)
            messagebox.showinfo("成功", "已成功应用压缩！原图已被覆盖。")
            
            # 清空显示
            self.clear_image_display()
            
        except Exception as e:
            messagebox.showerror("错误", f"应用压缩失败：{str(e)}")
    
    def cancel_compression(self):
        """取消压缩"""
        self.clear_image_display()
        messagebox.showinfo("提示", "已取消压缩")
    
    def clear_image_display(self):
        """清空图片显示"""
        self.original_canvas.delete("all")
        self.compressed_canvas.delete("all")
        self.original_info_label.config(text="")
        self.compressed_info_label.config(text="")
        self.info_label.config(text="请选择图片并开始压缩", foreground='gray')
        
        # 清空引用
        self.original_photo = None
        self.compressed_photo = None
        if hasattr(self, 'original_image_path'):
            delattr(self, 'original_image_path')
        if hasattr(self, 'compressed_image_path'):
            delattr(self, 'compressed_image_path')
    
    def open_temp_directory(self):
        """打开临时目录"""
        try:
            import subprocess
            temp_dir = os.path.abspath(TEMP_PREVIEW_DIR)
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir)
            subprocess.Popen(f'explorer "{temp_dir}"')
        except Exception as e:
            messagebox.showerror("错误", f"打开目录失败：{str(e)}")
    
    def compress_single_image(self):
        """压缩单张图片"""
        if not self.current_file:
            messagebox.showwarning("提示", "请先选择图片文件！")
            return
        
        try:
            # 获取参数
            mode = self.compress_mode.get()
            preserve_alpha = self.preserve_alpha.get()
            
            # 显示处理中
            messagebox.showinfo("处理中", "正在压缩图片，请稍候...")
            
            if mode == "target_size":
                # 按目标大小压缩
                target_size = self.target_size_kb.get()
                quality, actual_size_kb, temp_file = self.find_optimal_quality(
                    self.current_file, target_size, preserve_alpha
                )
                
                # 显示对比图片
                self.display_images(self.current_file, temp_file)
                
            else:
                # 按质量参数压缩
                ext = self.current_file.suffix.lower()
                if ext in ['.jpg', '.jpeg']:
                    quality = self.jpg_quality.get()
                else:
                    quality = self.png_quality.get()
                
                temp_file = Path(TEMP_PREVIEW_DIR) / f"preview_{self.current_file.name}"
                final_size = self.compress_image_with_quality(
                    self.current_file, temp_file, quality, preserve_alpha
                )
                
                # 显示对比图片
                self.display_images(self.current_file, temp_file)
            
        except Exception as e:
            messagebox.showerror("错误", f"压缩失败：{str(e)}")
    
    def create_batch_panel(self, parent):
        """创建批量压缩面板"""
        # 顶部信息栏
        info_frame = ttk.Frame(parent)
        info_frame.pack(fill=tk.X, pady=(0, 5))
        
        self.batch_info_label = ttk.Label(
            info_frame,
            text='请选择图片目录并点击"预览扫描"',
            font=('Arial', 10),
            foreground='gray'
        )
        self.batch_info_label.pack()
        
        # 文件列表区域
        list_container = ttk.LabelFrame(parent, text="文件列表")
        list_container.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # 创建列表视图frame（默认显示）
        self.list_view_frame = ttk.Frame(list_container)
        self.list_view_frame.pack(fill=tk.BOTH, expand=True)
        
        # 创建Gallery视图frame（初始隐藏）
        self.gallery_view_frame = ttk.Frame(list_container)
        
        # === 列表视图 ===
        # 创建Treeview（添加复选框列、节省比例列和质量参数列）
        columns = ('checkbox', 'filename', 'size', 'expected', 'saved', 'quality', 'status')
        self.batch_tree = ttk.Treeview(self.list_view_frame, columns=columns, show='tree headings', height=15)
        
        self.batch_tree.heading('#0', text='#')
        self.batch_tree.heading('checkbox', text='☐')
        self.batch_tree.heading('filename', text='文件名')
        self.batch_tree.heading('size', text='原始大小')
        self.batch_tree.heading('expected', text='压缩后')
        self.batch_tree.heading('saved', text='节省%')
        self.batch_tree.heading('quality', text='质量')
        self.batch_tree.heading('status', text='状态')
        
        self.batch_tree.column('#0', width=40, anchor=tk.CENTER)
        self.batch_tree.column('checkbox', width=40, anchor=tk.CENTER)
        self.batch_tree.column('filename', width=200)
        self.batch_tree.column('size', width=85)
        self.batch_tree.column('expected', width=85)
        self.batch_tree.column('saved', width=60, anchor=tk.CENTER)
        self.batch_tree.column('quality', width=90, anchor=tk.CENTER)
        self.batch_tree.column('status', width=100)
        
        # 绑定点击事件（用于切换复选框和排序）
        self.batch_tree.bind('<Button-1>', self.on_tree_click)
        self.batch_tree.bind('<Double-Button-1>', self.on_tree_double_click)
        
        # 滚动条
        list_scrollbar = ttk.Scrollbar(self.list_view_frame, orient=tk.VERTICAL, command=self.batch_tree.yview)
        self.batch_tree.configure(yscrollcommand=list_scrollbar.set)
        
        self.batch_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        list_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # === Gallery视图 ===
        # 创建Canvas和滚动条
        self.gallery_canvas = tk.Canvas(self.gallery_view_frame, bg='white')
        gallery_scrollbar = ttk.Scrollbar(self.gallery_view_frame, orient=tk.VERTICAL, command=self.gallery_canvas.yview)
        self.gallery_canvas.configure(yscrollcommand=gallery_scrollbar.set)
        
        self.gallery_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        gallery_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 创建Gallery内容frame
        self.gallery_content_frame = ttk.Frame(self.gallery_canvas)
        self.gallery_canvas_window = self.gallery_canvas.create_window((0, 0), window=self.gallery_content_frame, anchor='nw')
        
        # 绑定Canvas配置事件
        self.gallery_content_frame.bind('<Configure>', lambda e: self.gallery_canvas.configure(scrollregion=self.gallery_canvas.bbox('all')))
        self.gallery_canvas.bind('<Configure>', self._on_gallery_canvas_configure)
        
        # 缩略图缓存
        self.thumbnail_cache = {}  # {item_id: PhotoImage}
        
        # Shift批量选择相关
        self.last_convert_checked_item = None  # 记录最后点击的"→JPG"复选框的item
        
        # 列表操作按钮
        list_button_frame = ttk.Frame(parent)
        list_button_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Button(list_button_frame, text="☑ 全选", 
                   command=self.select_all_items).pack(side=tk.LEFT, padx=2)
        ttk.Button(list_button_frame, text="☐ 全不选",
                   command=self.deselect_all_items).pack(side=tk.LEFT, padx=2)
        ttk.Button(list_button_frame, text="🔍 查看对比",
                   command=self.view_selected_comparison).pack(side=tk.LEFT, padx=2)
        
        # 分组选项
        ttk.Label(list_button_frame, text="分组:").pack(side=tk.LEFT, padx=(20, 5))
        self.group_mode = tk.StringVar(value='none')
        ttk.Radiobutton(list_button_frame, text="不分组", variable=self.group_mode, 
                       value='none', command=self.refresh_view).pack(side=tk.LEFT, padx=2)
        ttk.Radiobutton(list_button_frame, text="按转换类型", variable=self.group_mode, 
                       value='conversion', command=self.refresh_view).pack(side=tk.LEFT, padx=2)
        
        # 视图模式切换
        ttk.Label(list_button_frame, text="视图:").pack(side=tk.LEFT, padx=(20, 5))
        self.view_mode = tk.StringVar(value='list')
        ttk.Radiobutton(list_button_frame, text="📋 列表", variable=self.view_mode, 
                       value='list', command=self.switch_view_mode).pack(side=tk.LEFT, padx=2)
        ttk.Radiobutton(list_button_frame, text="🖼️ 缩略图", variable=self.view_mode, 
                       value='gallery', command=self.switch_view_mode).pack(side=tk.LEFT, padx=2)
        
        ttk.Button(list_button_frame, text="💾 保存选中项",
                   command=self.save_selected_items).pack(side=tk.RIGHT, padx=2)
        
        # 进度区域
        progress_frame = ttk.Frame(parent)
        progress_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.batch_progress_label = ttk.Label(progress_frame, text="准备就绪", font=('Arial', 9))
        self.batch_progress_label.pack(anchor=tk.W)
        
        self.batch_progress = ttk.Progressbar(progress_frame, mode='determinate')
        self.batch_progress.pack(fill=tk.X, pady=(5, 0))
        
        # 统计信息区域（增强版）
        stats_frame = ttk.LabelFrame(parent, text="压缩统计")
        stats_frame.pack(fill=tk.X)
        
        stats_grid = ttk.Frame(stats_frame)
        stats_grid.pack(fill=tk.X, padx=10, pady=10)
        
        # 第一行
        ttk.Label(stats_grid, text="总文件数:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.stat_total_label = ttk.Label(stats_grid, text="0", foreground='blue')
        self.stat_total_label.grid(row=0, column=1, sticky=tk.W, padx=(5, 20))
        
        ttk.Label(stats_grid, text="已处理:").grid(row=0, column=2, sticky=tk.W, pady=2)
        self.stat_processed_label = ttk.Label(stats_grid, text="0", foreground='green')
        self.stat_processed_label.grid(row=0, column=3, sticky=tk.W, padx=5)
        
        # 第二行
        ttk.Label(stats_grid, text="原始总大小:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.stat_original_size_label = ttk.Label(stats_grid, text="0 B")
        self.stat_original_size_label.grid(row=1, column=1, sticky=tk.W, padx=(5, 20))
        
        ttk.Label(stats_grid, text="预期/压缩后:").grid(row=1, column=2, sticky=tk.W, pady=2)
        self.stat_compressed_size_label = ttk.Label(stats_grid, text="0 B")
        self.stat_compressed_size_label.grid(row=1, column=3, sticky=tk.W, padx=5)
        
        # 第三行
        ttk.Label(stats_grid, text="预期节省:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.stat_saved_label = ttk.Label(stats_grid, text="0 B (0%)", foreground='red')
        self.stat_saved_label.grid(row=2, column=1, columnspan=3, sticky=tk.W, padx=5)
        
        # 第四行 - 预估时间（新增）
        ttk.Label(stats_grid, text="预估时间:").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.stat_time_label = ttk.Label(stats_grid, text="--", foreground='purple')
        self.stat_time_label.grid(row=3, column=1, columnspan=3, sticky=tk.W, padx=5)
    
    def find_large_images(self, directory, min_size_mb):
        """查找大于指定大小的图片文件"""
        min_size_bytes = min_size_mb * 1024 * 1024
        large_images = []
        
        supported_formats = {'.jpg', '.jpeg', '.png'}
        
        for root, _, files in os.walk(directory):
            for file in files:
                file_path = Path(root) / file
                if file_path.suffix.lower() in supported_formats:
                    try:
                        size = file_path.stat().st_size
                        if size > min_size_bytes:
                            large_images.append(file_path)
                    except Exception:
                        continue
        
        return large_images
    
    def start_batch_compress(self):
        """开始批量压缩（已弃用 - 建议使用预览扫描）"""
        # 警告：不推荐跳过预览直接压缩
        if not messagebox.askyesno("⚠️ 警告", 
            "不推荐跳过预览直接批量压缩！\n\n"
            "建议流程：\n"
            '1. 点击"预览扫描"查看压缩效果\n'
            "2. 勾选满意的文件\n"
            '3. 点击"保存选中项"应用\n\n'
            "确定要跳过预览直接压缩所有文件吗？"):
            return
        
        if not self.current_dir:
            messagebox.showwarning("提示", "请先选择图片目录！")
            return
        
        try:
            # 获取参数
            min_size_mb = self.min_size_mb.get()
            
            # 扫描文件
            self.batch_info_label.config(text="正在扫描文件...", foreground='blue')
            self.root.update()
            
            large_images = self.find_large_images(self.current_dir, min_size_mb)
            
            if not large_images:
                messagebox.showinfo("提示", f"在目录中没有找到大于 {min_size_mb}MB 的图片文件")
                self.batch_info_label.config(text='请选择图片目录并点击"预览扫描"', foreground='gray')
                return
            
            # 清空列表
            for item in self.batch_tree.get_children():
                self.batch_tree.delete(item)
            
            # 填充文件列表
            for idx, img_path in enumerate(large_images, 1):
                size = img_path.stat().st_size
                self.batch_tree.insert(
                    '', 'end',
                    text=str(idx),
                    values=('☐', img_path.name, self.format_bytes(size), '--', '0%', '等待中')
                )
            
            self.batch_info_label.config(
                text=f"找到 {len(large_images)} 个文件，准备压缩...",
                foreground='orange'
            )
            
            # 确认开始压缩
            if not messagebox.askyesno("最后确认", f"找到 {len(large_images)} 个大于 {min_size_mb}MB 的图片文件\n\n确定要开始批量压缩吗？\n⚠️ 压缩后将直接覆盖原图，无法预览效果！"):
                self.batch_info_label.config(text="已取消", foreground='gray')
                return
            
            # 在新线程中执行压缩
            thread = threading.Thread(target=self.batch_compress_worker, args=(large_images,))
            thread.daemon = True
            thread.start()
            
        except Exception as e:
            messagebox.showerror("错误", f"批量压缩失败：{str(e)}")
            self.batch_info_label.config(text="压缩失败", foreground='red')
    
    def batch_compress_worker(self, image_list):
        """批量压缩工作线程"""
        try:
            total = len(image_list)
            processed = 0
            total_original_size = 0
            total_compressed_size = 0
            
            # 获取参数
            mode = self.compress_mode.get()
            target_size_kb = self.target_size_kb.get()
            jpg_quality = self.jpg_quality.get()
            png_quality = self.png_quality.get()
            preserve_alpha = self.preserve_alpha.get()
            max_workers = self.max_workers.get()
            
            # 更新进度
            self.batch_progress['maximum'] = total
            self.batch_progress['value'] = 0
            
            # 使用线程池处理
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                futures = {}
                for idx, img_path in enumerate(image_list):
                    if mode == "target_size":
                        future = executor.submit(
                            self.compress_single_file_batch,
                            img_path, target_size_kb, preserve_alpha, idx
                        )
                    else:
                        ext = img_path.suffix.lower()
                        quality = jpg_quality if ext in ['.jpg', '.jpeg'] else png_quality
                        future = executor.submit(
                            self.compress_with_quality_batch,
                            img_path, quality, preserve_alpha, idx
                        )
                    futures[future] = (idx, img_path)
                
                # 处理完成的任务
                for future in as_completed(futures):
                    idx, img_path = futures[future]
                    try:
                        result = future.result()
                        if result:
                            original_size, compressed_size, status = result
                            total_original_size += original_size
                            total_compressed_size += compressed_size
                            
                            # 更新树视图
                            items = self.batch_tree.get_children()
                            if idx < len(items):
                                self.batch_tree.item(items[idx], values=(
                                    img_path.name,
                                    self.format_bytes(original_size),
                                    status
                                ))
                        
                        processed += 1
                        
                        # 更新进度
                        self.batch_progress['value'] = processed
                        self.batch_progress_label.config(
                            text=f"正在处理: {processed}/{total} - {img_path.name}"
                        )
                        
                        # 更新统计
                        saved = total_original_size - total_compressed_size
                        saved_percent = (saved / total_original_size * 100) if total_original_size > 0 else 0
                        
                        self.stat_total_label.config(text=str(total))
                        self.stat_processed_label.config(text=str(processed))
                        self.stat_original_size_label.config(text=self.format_bytes(total_original_size))
                        self.stat_compressed_size_label.config(text=self.format_bytes(total_compressed_size))
                        self.stat_saved_label.config(
                            text=f"{self.format_bytes(saved)} ({saved_percent:.1f}%)"
                        )
                        
                    except Exception as e:
                        print(f"处理 {img_path} 时出错: {e}")
                        # 更新状态为失败
                        items = self.batch_tree.get_children()
                        if idx < len(items):
                            self.batch_tree.item(items[idx], values=(
                                img_path.name,
                                self.format_bytes(img_path.stat().st_size),
                                f"失败: {str(e)[:20]}"
                            ))
            
            # 完成
            self.batch_info_label.config(
                text=f"✓ 批量压缩完成！共处理 {processed} 个文件",
                foreground='green'
            )
            self.batch_progress_label.config(text="压缩完成！")
            
            # 询问是否应用
            if messagebox.askyesno("完成", f"批量压缩完成！\n\n共处理: {processed} 个文件\n节省空间: {self.format_bytes(saved)} ({saved_percent:.1f}%)\n\n压缩结果已保存到临时目录。\n是否要将压缩后的文件应用到原图？"):
                self.apply_batch_compression(image_list)
            
        except Exception as e:
            messagebox.showerror("错误", f"批量压缩出错：{str(e)}")
            self.batch_info_label.config(text="压缩失败", foreground='red')
    
    def compress_single_file_batch(self, img_path, target_size_kb, preserve_alpha, idx):
        """批量模式：按目标大小压缩单个文件"""
        try:
            original_size = img_path.stat().st_size
            quality, actual_size_kb, temp_file = self.find_optimal_quality(
                img_path, target_size_kb, preserve_alpha
            )
            compressed_size = temp_file.stat().st_size
            return (original_size, compressed_size, f"✓ {self.format_bytes(compressed_size)}")
        except Exception as e:
            return (img_path.stat().st_size, img_path.stat().st_size, f"✗ 失败")
    
    def compress_with_quality_batch(self, img_path, quality, preserve_alpha, idx):
        """批量模式：按质量参数压缩单个文件"""
        try:
            original_size = img_path.stat().st_size
            temp_file = Path(TEMP_PREVIEW_DIR) / f"preview_{img_path.name}"
            compressed_size = self.compress_image_with_quality(
                img_path, temp_file, quality, preserve_alpha
            )
            return (original_size, compressed_size, f"✓ {self.format_bytes(compressed_size)}")
        except Exception as e:
            return (img_path.stat().st_size, img_path.stat().st_size, f"✗ 失败")
    
    def apply_batch_compression(self, image_list):
        """应用批量压缩结果"""
        try:
            success_count = 0
            for img_path in image_list:
                temp_file = Path(TEMP_PREVIEW_DIR) / f"preview_{img_path.name}"
                
                # 也检查是否有格式转换后的文件（如 preview_xxx.jpg 对应原来的 xxx.png）
                if not temp_file.exists():
                    # 尝试查找不同扩展名的预览文件
                    stem = f"preview_{img_path.stem}"
                    for candidate in Path(TEMP_PREVIEW_DIR).glob(f"{stem}.*"):
                        temp_file = candidate
                        break
                
                if temp_file.exists():
                    if temp_file.suffix.lower() != img_path.suffix.lower():
                        # 格式发生变化：复制为新扩展名，删除原文件
                        new_path = img_path.with_suffix(temp_file.suffix)
                        shutil.copy2(temp_file, new_path)
                        if new_path != img_path and img_path.exists():
                            img_path.unlink()
                    else:
                        shutil.copy2(temp_file, img_path)
                    success_count += 1
            
            messagebox.showinfo("成功", f"已成功应用 {success_count}/{len(image_list)} 个文件的压缩结果！")
            
            # 清空临时文件
            self.clean_temp_files()
            
        except Exception as e:
            messagebox.showerror("错误", f"应用批量压缩失败：{str(e)}")
    
    def preview_batch_compress(self):
        """预览批量压缩效果（新增功能）"""
        if not self.current_dir:
            messagebox.showwarning("提示", "请先选择图片目录！")
            return
        
        try:
            # 获取参数
            min_size_mb = self.min_size_mb.get()
            
            # 扫描文件
            self.batch_info_label.config(text="正在扫描文件...", foreground='blue')
            self.root.update()
            
            large_images = self.find_large_images(self.current_dir, min_size_mb)
            
            if not large_images:
                messagebox.showinfo("提示", f"在目录中没有找到大于 {min_size_mb}MB 的图片文件")
                self.batch_info_label.config(text='请选择图片目录并点击"预览扫描"', foreground='gray')
                return
            
            # 清空列表
            for item in self.batch_tree.get_children():
                self.batch_tree.delete(item)
            
            # 填充文件列表
            for idx, img_path in enumerate(large_images, 1):
                size = img_path.stat().st_size
                self.batch_tree.insert(
                    '', 'end',
                    text=str(idx),
                    values=(img_path.name, self.format_bytes(size), '--', '准备预览')
                )
            
            self.batch_info_label.config(
                text=f"找到 {len(large_images)} 个文件，开始预览测试...",
                foreground='blue'
            )
            self.root.update()
            
            # 在新线程中执行预览
            thread = threading.Thread(target=self.preview_worker, args=(large_images,))
            thread.daemon = True
            thread.start()
            
        except Exception as e:
            messagebox.showerror("错误", f"预览失败：{str(e)}")
            self.batch_info_label.config(text="预览失败", foreground='red')
    
    def preview_worker(self, image_list):
        """预览工作线程 - 测试压缩效果并保存结果"""
        try:
            total = len(image_list)
            processed = 0
            total_original_size = 0
            total_expected_size = 0
            
            # 清空之前的数据
            self.batch_files_data.clear()
            
            # 获取参数
            mode = self.compress_mode.get()
            target_size_kb = self.target_size_kb.get()
            jpg_quality = self.jpg_quality.get()
            png_quality = self.png_quality.get()
            preserve_alpha = self.preserve_alpha.get()
            max_workers = self.max_workers.get()
            
            # 更新进度
            self.batch_progress['maximum'] = total
            self.batch_progress['value'] = 0
            
            # 记录开始时间
            start_time = time.time()
            
            # 使用线程池处理
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                futures = {}
                for idx, img_path in enumerate(image_list):
                    if mode == "target_size":
                        future = executor.submit(
                            self.preview_single_file,
                            img_path, target_size_kb, preserve_alpha, idx
                        )
                    else:
                        ext = img_path.suffix.lower()
                        quality = jpg_quality if ext in ['.jpg', '.jpeg'] else png_quality
                        future = executor.submit(
                            self.preview_with_quality,
                            img_path, quality, preserve_alpha, idx
                        )
                    futures[future] = (idx, img_path)
                
                # 处理完成的任务
                for future in as_completed(futures):
                    idx, img_path = futures[future]
                    try:
                        result = future.result()
                        if result and len(result) == 4:
                            original_size, expected_size, preview_file, compression_info = result
                            total_original_size += original_size
                            total_expected_size += expected_size
                            
                            reduction = compression_info.get('reduction', 0)
                            
                            # 格式化质量参数显示
                            method = compression_info.get('method', 'Unknown')
                            quality_display = self._format_quality_display(compression_info)
                            
                            # 格式化状态显示
                            status_display = self._format_status_display(compression_info, expected_size)
                            
                            # 更新树视图
                            items = self.batch_tree.get_children()
                            if idx < len(items):
                                item_id = items[idx]
                                
                                # 保存文件数据（关键：默认勾选）
                                self.batch_files_data[item_id] = {
                                    'path': img_path,
                                    'original_size': original_size,
                                    'compressed_size': expected_size,
                                    'preview_file': preview_file,
                                    'checked': True,  # 默认勾选
                                    'reduction': reduction,
                                    'compression_info': compression_info
                                }
                                
                                self.batch_tree.item(item_id, values=(
                                    '☑',  # 默认勾选
                                    img_path.name,
                                    self.format_bytes(original_size),
                                    self.format_bytes(expected_size),
                                    f"{reduction:.1f}%",
                                    quality_display,
                                    status_display
                                ))
                        
                        processed += 1
                        
                        # 更新进度
                        self.batch_progress['value'] = processed
                        self.batch_progress_label.config(
                            text=f"预览测试: {processed}/{total} - {img_path.name}"
                        )
                        
                        # 更新统计
                        saved = total_original_size - total_expected_size
                        saved_percent = (saved / total_original_size * 100) if total_original_size > 0 else 0
                        
                        self.stat_total_label.config(text=str(total))
                        self.stat_processed_label.config(text=f"{processed} (预览)")
                        self.stat_original_size_label.config(text=self.format_bytes(total_original_size))
                        self.stat_compressed_size_label.config(text=self.format_bytes(total_expected_size))
                        self.stat_saved_label.config(
                            text=f"{self.format_bytes(saved)} ({saved_percent:.1f}%)"
                        )
                        
                        # 计算预估时间
                        if processed > 0:
                            elapsed = time.time() - start_time
                            avg_time = elapsed / processed
                            estimated_total = avg_time * total
                            self.stat_time_label.config(
                                text=f"约 {int(estimated_total / 60)}分{int(estimated_total % 60)}秒"
                            )
                        
                    except Exception as e:
                        print(f"预览 {img_path} 时出错: {e}")
                        import traceback
                        traceback.print_exc()
                        # 更新状态为失败
                        items = self.batch_tree.get_children()
                        if idx < len(items):
                            item_id = items[idx]
                            original_size = img_path.stat().st_size
                            
                            # 失败的compression_info
                            compression_info = {
                                'method': 'FAILED',
                                'quality': None,
                                'compress_level': None,
                                'target_reached': False,
                                'actual_size': original_size,
                                'reduction': 0,
                                'error': str(e)
                            }
                            
                            # 即使失败也记录数据
                            self.batch_files_data[item_id] = {
                                'path': img_path,
                                'original_size': original_size,
                                'compressed_size': original_size,
                                'preview_file': None,
                                'checked': False,  # 失败的不勾选
                                'reduction': 0,
                                'compression_info': compression_info
                            }
                            
                            self.batch_tree.item(item_id, values=(
                                '☐',
                                img_path.name,
                                self.format_bytes(original_size),
                                '--',
                                '0%',
                                '失败',
                                '✗ 预览失败'
                            ))
            
            # 完成
            self.batch_info_label.config(
                text=f"✓ 预览完成！共测试 {processed} 个文件，预计节省 {self.format_bytes(saved)} ({saved_percent:.1f}%)",
                foreground='green'
            )
            self.batch_progress_label.config(text='预览完成！点击"保存选中项"来应用压缩')
            
            # 提示用户查看结果
            messagebox.showinfo("预览完成", 
                f'预览测试完成！\n\n总文件数: {processed}\n原始总大小: {self.format_bytes(total_original_size)}\n预期压缩后: {self.format_bytes(total_expected_size)}\n预期节省: {self.format_bytes(saved)} ({saved_percent:.1f}%)\n\n请查看列表，勾选要保存的文件，\n然后点击"保存选中项"按钮。')
            
        except Exception as e:
            messagebox.showerror("错误", f"预览出错：{str(e)}")
            self.batch_info_label.config(text="预览失败", foreground='red')
    
    def preview_single_file(self, img_path, target_size_kb, preserve_alpha, idx):
        """预览单个文件（按目标大小）- 保存结果到临时目录"""
        try:
            original_size = img_path.stat().st_size
            
            # 执行智能压缩测试（返回4个值）
            quality_or_level, actual_size_kb, preview_file, compression_info = self.find_optimal_quality(
                img_path, target_size_kb, preserve_alpha
            )
            
            expected_size = int(actual_size_kb * 1024)
            
            # 保留预览文件，不删除
            # preview_file 已经由 find_optimal_quality 生成并保存
            
            return (original_size, expected_size, preview_file, compression_info)
        except Exception as e:
            print(f"预览失败: {img_path} - {e}")
            import traceback
            traceback.print_exc()
            # 返回失败的compression_info
            compression_info = {
                'method': 'FAILED',
                'quality': None,
                'compress_level': None,
                'target_reached': False,
                'actual_size': img_path.stat().st_size,
                'reduction': 0,
                'error': str(e)
            }
            return (img_path.stat().st_size, img_path.stat().st_size, None, compression_info)
    
    def preview_with_quality(self, img_path, quality, preserve_alpha, idx):
        """预览单个文件（按质量参数）- 保存结果到临时目录"""
        try:
            original_size = img_path.stat().st_size
            
            # 保存到预览目录
            preview_file = Path(TEMP_PREVIEW_DIR) / f"preview_{img_path.name}"
            
            # 执行压缩测试
            compressed_size = self.compress_image_with_quality(
                img_path, preview_file, quality, preserve_alpha
            )
            
            # 保留预览文件，不删除（关键改动）
            
            return (original_size, compressed_size, preview_file)
        except Exception as e:
            print(f"预览失败: {img_path} - {e}")
            return (img_path.stat().st_size, img_path.stat().st_size, None)
    
    # 文件选择方法
    def select_single_file(self):
        """选择单个图片文件"""
        file_path = filedialog.askopenfilename(
            title="选择图片文件",
            filetypes=[
                ("图片文件", "*.jpg *.jpeg *.png"),
                ("JPG文件", "*.jpg *.jpeg"),
                ("PNG文件", "*.png"),
                ("所有文件", "*.*")
            ]
        )
        if file_path:
            self.current_file = Path(file_path)
            messagebox.showinfo("提示", f"已选择文件：\n{self.current_file.name}")
    
    def select_directory(self):
        """选择目录"""
        dir_path = filedialog.askdirectory(title="选择图片目录")
        if dir_path:
            self.current_dir = Path(dir_path)
            messagebox.showinfo("提示", f"已选择目录：\n{self.current_dir}")
    
    # 清理和退出方法
    def clean_temp_files(self):
        """清理临时文件"""
        try:
            if os.path.exists(TEMP_PREVIEW_DIR):
                shutil.rmtree(TEMP_PREVIEW_DIR)
                os.makedirs(TEMP_PREVIEW_DIR, exist_ok=True)
                messagebox.showinfo("成功", "临时文件已清理！")
        except Exception as e:
            messagebox.showerror("错误", f"清理失败：{str(e)}")
    
    def on_closing(self):
        """窗口关闭事件"""
        if messagebox.askokcancel("退出", "确定要退出吗？"):
            # 清理临时文件
            try:
                if os.path.exists(TEMP_PREVIEW_DIR):
                    shutil.rmtree(TEMP_PREVIEW_DIR)
            except:
                pass
            self.root.destroy()
    
    # 帮助菜单方法
    def show_help(self):
        """显示使用说明"""
        help_text = """
        📖 使用说明
        
        【单图测试】
        1. 点击"选择图片文件"选择要压缩的图片
        2. 设置压缩参数（目标大小或质量）
        3. 点击"开始压缩"查看效果
        4. 满意后点击"应用"覆盖原图
        
        【批量压缩】
        1. 点击"选择图片目录"选择目录
        2. 设置筛选条件（文件大小阈值）
        3. 设置压缩参数
        4. 点击"开始批量压缩"
        5. 查看统计结果
        
        💡 提示：
        - 勾选"保留透明通道"可保留PNG透明效果
        - 目标大小模式会自动调整质量参数
        - 压缩前会先保存到临时目录，确认后才覆盖
        """
        messagebox.showinfo("使用说明", help_text)
    
    def show_about(self):
        """显示关于信息"""
        about_text = """
        🖼️ 图片压缩工具 v1.0
        
        功能特点：
        • 智能目标大小压缩
        • 安全预览机制
        • 透明通道保留
        • 批量处理支持
        
        支持格式：JPG, PNG
        
        © 2024 图片压缩工具
        """
        messagebox.showinfo("关于", about_text)
    
    # 批量列表操作方法
    def on_tree_click(self, event):
        """树视图单击事件 - 处理复选框切换"""
        region = self.batch_tree.identify("region", event.x, event.y)
        if region == "cell":
            column = self.batch_tree.identify_column(event.x)
            item = self.batch_tree.identify_row(event.y)
            
            # 检查是否为分组标题
            if item and self.is_group_header(item):
                return "break"  # 分组标题不响应点击
            
            if column == '#1' and item:  # 复选框列
                self.toggle_checkbox(item)
                return "break"  # 阻止默认选择行为
    
    def on_tree_double_click(self, event):
        """树视图双击事件 - 查看对比图"""
        item = self.batch_tree.identify_row(event.y)
        if item and not self.is_group_header(item):
            self.view_comparison_for_item(item)
    
    def is_group_header(self, item):
        """判断是否为分组标题"""
        tags = self.batch_tree.item(item, 'tags')
        return 'group_header' in tags if tags else False
    
    def toggle_checkbox(self, item):
        """切换复选框状态"""
        if item in self.batch_files_data:
            # 切换选中状态
            self.batch_files_data[item]['checked'] = not self.batch_files_data[item]['checked']
            
            # 更新显示
            checkbox = '☑' if self.batch_files_data[item]['checked'] else '☐'
            values = list(self.batch_tree.item(item, 'values'))
            values[0] = checkbox
            self.batch_tree.item(item, values=values)
            
            # 更新统计
            self.update_batch_stats()
    
    def _on_gallery_canvas_configure(self, event):
        """Gallery Canvas大小改变时调整内容宽度"""
        canvas_width = event.width
        self.gallery_canvas.itemconfig(self.gallery_canvas_window, width=canvas_width)
    
    def switch_view_mode(self):
        """切换视图模式"""
        mode = self.view_mode.get()
        
        if mode == 'list':
            # 显示列表视图，隐藏Gallery视图
            self.gallery_view_frame.pack_forget()
            self.list_view_frame.pack(fill=tk.BOTH, expand=True)
        elif mode == 'gallery':
            # 显示Gallery视图，隐藏列表视图
            self.list_view_frame.pack_forget()
            self.gallery_view_frame.pack(fill=tk.BOTH, expand=True)
            # 刷新Gallery显示
            self.refresh_gallery_view()
    
    def refresh_view(self):
        """刷新当前视图（应用分组和视图模式）"""
        mode = self.view_mode.get()
        
        if mode == 'list':
            self.refresh_list_display()
        elif mode == 'gallery':
            self.refresh_gallery_view()
    
    def refresh_gallery_view(self):
        """刷新Gallery视图"""
        # 清空Gallery
        for widget in self.gallery_content_frame.winfo_children():
            widget.destroy()
        
        if not self.batch_files_data:
            return
        
        # 获取分组模式
        group_mode = self.group_mode.get()
        
        if group_mode == 'none':
            # 不分组
            self._display_gallery_items(list(self.batch_files_data.keys()), None)
        elif group_mode == 'conversion':
            # 按转换类型分组
            groups = self.group_files_by_conversion()
            
            # 定义分组顺序
            group_order = [
                ('PNG→JPG', '🔄'),
                ('JPG优化', '📷'),
                ('PNG保持', '🖼️'),
                ('其他', '📄')
            ]
            
            for group_name, icon in group_order:
                if group_name in groups:
                    self._display_gallery_items(groups[group_name], f'{icon} {group_name}')
    
    def _display_gallery_items(self, item_ids, group_title=None):
        """在Gallery中显示一组item
        
        Args:
            item_ids: item_id列表
            group_title: 分组标题（None表示不分组）
        """
        # 如果有分组标题，先显示标题
        if group_title:
            title_frame = ttk.Frame(self.gallery_content_frame)
            title_frame.pack(fill=tk.X, padx=5, pady=(10, 5))
            
            title_label = ttk.Label(title_frame, text=group_title, 
                                   font=('Arial', 11, 'bold'),
                                   background='#e0e0e0')
            title_label.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5, pady=2)
            
            # 如果是PNG保持组，添加"转换为JPG"按钮
            if 'PNG保持' in group_title:
                convert_btn = ttk.Button(title_frame, text="🔄 转换选中为JPG", 
                                        command=lambda: self.convert_selected_png_to_jpg(item_ids))
                convert_btn.pack(side=tk.RIGHT, padx=5, pady=2)
        
        # 创建网格容器
        grid_frame = ttk.Frame(self.gallery_content_frame)
        grid_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 配置列权重（让所有列均匀分布）
        max_cols = 6  # 最多显示6列
        for col in range(max_cols):
            grid_frame.columnconfigure(col, weight=1, uniform='gallery_col')
        
        # 计算每行显示的缩略图数量（根据窗口宽度）
        col_count = 0
        row_count = 0
        
        for idx, item_id in enumerate(item_ids):
            if item_id not in self.batch_files_data:
                continue
            
            data = self.batch_files_data[item_id]
            
            # 创建缩略图卡片
            card = self._create_thumbnail_card(grid_frame, item_id, data)
            
            # 网格布局（每行6个，自适应）
            card.grid(row=row_count, column=col_count, padx=5, pady=5, sticky='ew')
            
            col_count += 1
            if col_count >= max_cols:  # 每行6个
                col_count = 0
                row_count += 1
    
    def _create_thumbnail_card(self, parent, item_id, data):
        """创建缩略图卡片
        
        Args:
            parent: 父容器
            item_id: item ID
            data: 文件数据
            
        Returns:
            卡片frame
        """
        # 创建卡片frame
        card = ttk.Frame(parent, relief=tk.RIDGE, borderwidth=1)
        
        # 判断是否为PNG保持类型
        method = data.get('compression_info', {}).get('method', '')
        is_png_keep = (method == 'PNG')
        
        # 顶部复选框区域
        checkbox_frame = ttk.Frame(card)
        checkbox_frame.pack(anchor=tk.NW, fill=tk.X, padx=2, pady=2)
        
        # 主复选框（保存）
        checkbox_var = tk.BooleanVar(value=data.get('checked', False))
        checkbox = ttk.Checkbutton(checkbox_frame, text="保存", variable=checkbox_var,
                                   command=lambda: self._on_gallery_checkbox_toggle(item_id, checkbox_var))
        checkbox.pack(side=tk.LEFT, padx=2)
        
        # 如果是PNG保持，添加"可转JPG"复选框
        if is_png_keep:
            can_convert_var = tk.BooleanVar(value=data.get('can_convert_jpg', False))
            convert_checkbox = ttk.Checkbutton(checkbox_frame, text="→JPG", variable=can_convert_var,
                                              command=lambda: self._on_convert_checkbox_toggle(item_id, can_convert_var, None))
            convert_checkbox.pack(side=tk.LEFT, padx=2)
            
            # 绑定Shift+点击事件
            convert_checkbox.bind('<Button-1>', lambda e: self._on_convert_checkbox_click(e, item_id, can_convert_var))
        
        # 缩略图
        thumbnail_label = tk.Label(card, bg='#f0f0f0', width=150, height=150)
        thumbnail_label.pack(padx=5, pady=5)
        
        # 加载缩略图
        self._load_thumbnail(item_id, thumbnail_label)
        
        # 文件名（截断显示）
        filename = data['path'].name
        if len(filename) > 20:
            filename = filename[:17] + '...'
        name_label = ttk.Label(card, text=filename, font=('Arial', 9))
        name_label.pack(pady=(0, 2))
        
        # 大小信息
        size_text = f"{self.format_bytes(data['compressed_size'])}"
        size_label = ttk.Label(card, text=size_text, font=('Arial', 8), foreground='gray')
        size_label.pack(pady=(0, 5))
        
        # 绑定双击事件（查看对比）
        thumbnail_label.bind('<Double-Button-1>', lambda e: self.view_comparison_for_item(item_id))
        card.bind('<Double-Button-1>', lambda e: self.view_comparison_for_item(item_id))
        
        return card
    
    def _load_thumbnail(self, item_id, label):
        """加载缩略图到label
        
        Args:
            item_id: item ID
            label: Label控件
        """
        # 检查缓存
        if item_id in self.thumbnail_cache:
            label.config(image=self.thumbnail_cache[item_id])
            return
        
        data = self.batch_files_data.get(item_id)
        if not data:
            return
        
        preview_file = data.get('preview_file')
        if not preview_file or not Path(preview_file).exists():
            return
        
        try:
            # 加载图片
            img = Image.open(preview_file)
            
            # 生成缩略图（150x150）
            img.thumbnail((150, 150), Image.Resampling.LANCZOS)
            
            # 转换为PhotoImage并缓存
            photo = ImageTk.PhotoImage(img)
            self.thumbnail_cache[item_id] = photo
            
            # 显示
            label.config(image=photo)
            
        except Exception as e:
            print(f"加载缩略图失败 {item_id}: {e}")
    
    def _on_gallery_checkbox_toggle(self, item_id, checkbox_var):
        """Gallery视图复选框切换"""
        if item_id in self.batch_files_data:
            checked = checkbox_var.get()
            self.batch_files_data[item_id]['checked'] = checked
            
            # 同步更新列表视图
            if self.batch_tree.exists(item_id):
                values = list(self.batch_tree.item(item_id, 'values'))
                values[0] = '☑' if checked else '☐'
                self.batch_tree.item(item_id, values=values)
            
            # 更新统计
            self.update_batch_stats()
    
    def _on_convert_checkbox_click(self, event, item_id, checkbox_var):
        """可转JPG复选框点击事件（处理Shift批量选择）"""
        # 注意：这个事件在复选框状态改变之前触发
        # 所以新状态是当前状态的反转
        new_state = not checkbox_var.get()
        
        # 如果按下了Shift键且有上一次点击的记录
        if event.state & 0x0001 and self.last_convert_checked_item:  # 0x0001 = Shift键
            # 获取PNG保持组的所有文件
            png_keep_items = []
            for iid, data in self.batch_files_data.items():
                method = data.get('compression_info', {}).get('method', '')
                if method == 'PNG':
                    png_keep_items.append(iid)
            
            # 找到当前item和上次item在列表中的位置
            try:
                start_idx = png_keep_items.index(self.last_convert_checked_item)
                end_idx = png_keep_items.index(item_id)
                
                # 确保start <= end
                if start_idx > end_idx:
                    start_idx, end_idx = end_idx, start_idx
                
                # 批量设置范围内的所有item
                for i in range(start_idx, end_idx + 1):
                    target_item = png_keep_items[i]
                    self.batch_files_data[target_item]['can_convert_jpg'] = new_state
                
                # 刷新Gallery视图以更新复选框状态
                if self.view_mode.get() == 'gallery':
                    self.refresh_gallery_view()
                
                # 记录本次点击
                self.last_convert_checked_item = item_id
                
                # 阻止默认的复选框切换（因为我们已经手动处理了）
                return "break"
                
            except ValueError:
                # 如果找不到索引，正常处理
                pass
        
        # 记录本次点击
        self.last_convert_checked_item = item_id
    
    def _on_convert_checkbox_toggle(self, item_id, checkbox_var, event):
        """可转JPG复选框切换"""
        if item_id in self.batch_files_data:
            can_convert = checkbox_var.get()
            self.batch_files_data[item_id]['can_convert_jpg'] = can_convert
            
            # 记录点击
            self.last_convert_checked_item = item_id
    
    def convert_selected_png_to_jpg(self, item_ids):
        """转换选中的PNG文件为JPG"""
        # 获取勾选了can_convert_jpg的文件
        convert_files = []
        for item_id in item_ids:
            if item_id in self.batch_files_data:
                data = self.batch_files_data[item_id]
                if data.get('can_convert_jpg', False):
                    convert_files.append((item_id, data))
        
        if not convert_files:
            messagebox.showinfo("提示", "没有勾选需要转换的文件！")
            return
        
        # 确认转换
        if not messagebox.askyesno("确认转换", 
            f"确定要将 {len(convert_files)} 个PNG文件转换为JPG格式重新压缩吗？\n\n"
            "这将使用JPG格式重新压缩文件，可能会获得更好的压缩效果。"):
            return
        
        # 开始转换
        self.batch_progress_label.config(text="正在转换为JPG...", foreground='blue')
        self.batch_progress['maximum'] = len(convert_files)
        self.batch_progress['value'] = 0
        
        # 在新线程中执行
        thread = threading.Thread(target=self._convert_to_jpg_worker, args=(convert_files,))
        thread.daemon = True
        thread.start()
    
    def _convert_to_jpg_worker(self, convert_files):
        """转换为JPG的工作线程"""
        try:
            # 获取参数
            target_size_kb = self.target_size_kb.get()
            
            success_count = 0
            for idx, (item_id, data) in enumerate(convert_files):
                try:
                    img_path = data['path']
                    
                    # 强制使用JPG格式重新压缩
                    quality, actual_size_kb, preview_file, compression_info = self.find_optimal_quality(
                        img_path, target_size_kb, preserve_alpha=False, force_jpg=True
                    )
                    
                    expected_size = int(actual_size_kb * 1024)
                    original_size = data['original_size']
                    
                    # 更新文件数据
                    self.batch_files_data[item_id].update({
                        'compressed_size': expected_size,
                        'preview_file': preview_file,
                        'compression_info': compression_info,
                        'reduction': (1 - expected_size / original_size) * 100 if original_size > 0 else 0,
                        'can_convert_jpg': False  # 清除标记
                    })
                    
                    success_count += 1
                    
                except Exception as e:
                    print(f"转换失败 {data['path']}: {e}")
                
                # 更新进度
                self.batch_progress['value'] = idx + 1
                self.batch_progress_label.config(
                    text=f"转换进度: {idx + 1}/{len(convert_files)}"
                )
            
            # 完成后刷新视图
            self.batch_progress_label.config(
                text=f"转换完成！成功 {success_count}/{len(convert_files)} 个文件",
                foreground='green'
            )
            
            # 刷新显示
            self.refresh_view()
            self.update_batch_stats()
            
            # 提示
            messagebox.showinfo("转换完成", 
                f"成功转换 {success_count}/{len(convert_files)} 个文件！\n\n"
                "已更新为JPG格式的压缩结果。")
            
        except Exception as e:
            print(f"转换过程出错: {e}")
            import traceback
            traceback.print_exc()
            self.batch_progress_label.config(text="转换失败", foreground='red')
            messagebox.showerror("错误", f"转换失败：{str(e)}")
    
    def group_files_by_conversion(self):
        """按转换类型分组文件
        
        Returns:
            dict: 分组结果 {'PNG保持': [...], 'PNG→JPG': [...], 'JPG优化': [...]}
        """
        groups = {
            'PNG保持': [],
            'PNG→JPG': [],
            'JPG优化': [],
            '其他': []
        }
        
        for item_id in self.batch_files_data.keys():
            data = self.batch_files_data.get(item_id)
            if data and 'compression_info' in data:
                method = data['compression_info'].get('method', 'Unknown')
                
                if method == 'PNG':
                    groups['PNG保持'].append(item_id)
                elif method == 'PNG→JPG':
                    groups['PNG→JPG'].append(item_id)
                elif method == 'JPG':
                    groups['JPG优化'].append(item_id)
                else:
                    groups['其他'].append(item_id)
        
        # 移除空分组
        return {k: v for k, v in groups.items() if v}
    
    def refresh_list_display(self):
        """刷新列表显示（应用分组）"""
        group_mode = self.group_mode.get()
        
        if group_mode == 'none':
            # 不分组：按原始顺序显示
            self.display_list_without_grouping()
        elif group_mode == 'conversion':
            # 按转换类型分组
            self.display_list_with_grouping()
    
    def display_list_without_grouping(self):
        """不分组显示（按索引顺序）"""
        # 保存当前数据
        saved_data = {}
        for item in self.batch_tree.get_children():
            if item in self.batch_files_data:
                data = self.batch_files_data[item]
                index = self.batch_tree.index(item)
                saved_data[index] = (item, data, self.batch_tree.item(item, 'values'))
        
        # 清空列表
        for item in self.batch_tree.get_children():
            self.batch_tree.delete(item)
        
        # 按索引重新插入
        for index in sorted(saved_data.keys()):
            item_id, data, values = saved_data[index]
            self.batch_tree.insert(
                '', 'end',
                iid=item_id,
                text=str(index + 1),
                values=values,
                tags=('file_item',)
            )
        
        # 配置普通项的样式
        self.batch_tree.tag_configure('file_item', background='white')
    
    def display_list_with_grouping(self):
        """按分组显示"""
        # 清空列表
        for item in self.batch_tree.get_children():
            self.batch_tree.delete(item)
        
        # 获取分组
        groups = self.group_files_by_conversion()
        
        # 定义分组顺序和图标
        group_order = [
            ('PNG→JPG', '🔄'),
            ('JPG优化', '📷'),
            ('PNG保持', '🖼️'),
            ('其他', '📄')
        ]
        
        file_index = 1
        for group_name, icon in group_order:
            if group_name not in groups:
                continue
            
            items = groups[group_name]
            
            # 计算分组统计
            total_size = sum(self.batch_files_data[item]['original_size'] for item in items)
            compressed_size = sum(self.batch_files_data[item]['compressed_size'] for item in items)
            reduction = (1 - compressed_size / total_size) * 100 if total_size > 0 else 0
            
            # 插入分组标题
            group_id = f"group_{group_name}"
            self.batch_tree.insert(
                '', 'end',
                iid=group_id,
                text='',
                values=('', f'{icon} {group_name} ({len(items)}个文件)', 
                       self.format_bytes(total_size),
                       self.format_bytes(compressed_size),
                       f'{reduction:.1f}%',
                       '', ''),
                tags=('group_header',)
            )
            
            # 插入该组的文件
            for item_id in items:
                data = self.batch_files_data[item_id]
                values = self.batch_tree.item(item_id, 'values') if self.batch_tree.exists(item_id) else None
                
                if not values:
                    # 重新构建values
                    checkbox = '☑' if data.get('checked', False) else '☐'
                    filename = data['path'].name
                    original_size_str = self.format_bytes(data['original_size'])
                    compressed_size_str = self.format_bytes(data['compressed_size'])
                    reduction_str = f"{data.get('reduction', 0):.1f}%"
                    quality_str = self._format_quality_display(data.get('compression_info', {}))
                    status_str = self._format_status_display(data.get('compression_info', {}), data['compressed_size'])
                    values = (checkbox, filename, original_size_str, compressed_size_str, reduction_str, quality_str, status_str)
                
                self.batch_tree.insert(
                    '', 'end',
                    iid=item_id,
                    text=str(file_index),
                    values=values,
                    tags=('file_item',)
                )
                file_index += 1
        
        # 配置标签样式
        self.batch_tree.tag_configure('group_header', background='#e0e0e0', font=('Arial', 10, 'bold'))
        self.batch_tree.tag_configure('file_item', background='white')
    
    def select_all_items(self):
        """全选"""
        for item in self.batch_tree.get_children():
            if item in self.batch_files_data and not self.is_group_header(item):
                self.batch_files_data[item]['checked'] = True
                values = list(self.batch_tree.item(item, 'values'))
                values[0] = '☑'
                self.batch_tree.item(item, values=values)
        self.update_batch_stats()
        messagebox.showinfo("提示", "已全选所有文件")
    
    def deselect_all_items(self):
        """全不选"""
        for item in self.batch_tree.get_children():
            if item in self.batch_files_data and not self.is_group_header(item):
                self.batch_files_data[item]['checked'] = False
                values = list(self.batch_tree.item(item, 'values'))
                values[0] = '☐'
                self.batch_tree.item(item, values=values)
        self.update_batch_stats()
        messagebox.showinfo("提示", "已取消选择所有文件")
    
    def view_selected_comparison(self):
        """查看选中项的对比图"""
        selection = self.batch_tree.selection()
        if not selection:
            messagebox.showwarning("提示", "请先选择一个文件！")
            return
        
        item = selection[0]
        self.view_comparison_for_item(item)
    
    def view_comparison_for_item(self, item):
        """查看指定项的对比图"""
        if item not in self.batch_files_data:
            messagebox.showwarning("提示", "该文件没有预览数据！")
            return
        
        data = self.batch_files_data[item]
        if not data.get('preview_file') or not Path(data['preview_file']).exists():
            messagebox.showwarning("提示", "预览文件不存在！请先进行预览扫描。")
            return
        
        # 获取所有文件列表（排除分组标题）
        file_list = [item_id for item_id in self.batch_tree.get_children() 
                    if not self.is_group_header(item_id)]
        current_index = file_list.index(item)
        
        # 打开预览对比窗口（支持左右切换）
        ComparisonPreviewWindow(self.root, file_list, current_index, self)
    
    def save_selected_items(self):
        """保存选中的文件"""
        # 获取勾选的文件
        selected_items = [item for item in self.batch_tree.get_children() 
                         if item in self.batch_files_data and self.batch_files_data[item].get('checked', False)]
        
        if not selected_items:
            messagebox.showwarning("提示", "请先勾选要保存的文件！")
            return
        
        # 检查是否有格式转换的文件（PNG→JPG），给出额外提示
        format_changed_count = sum(
            1 for item in selected_items 
            if self.batch_files_data[item].get('compression_info', {}).get('method', '') == 'PNG→JPG'
        )
        
        confirm_msg = f"确定要用压缩后的图片覆盖选中的 {len(selected_items)} 个原图吗？\n此操作不可撤销！"
        if format_changed_count > 0:
            confirm_msg += f"\n\n📌 其中 {format_changed_count} 个PNG文件已转为JPG压缩：\n"
            confirm_msg += "  • JPG内容将直接覆盖原 .png 文件\n"
            confirm_msg += "  • 文件名保持不变（浏览器可正常显示）"
        
        # 确认操作
        if not messagebox.askyesno("确认", confirm_msg):
            return
        
        try:
            success_count = 0
            fail_count = 0
            fail_files = []
            for item in selected_items:
                data = self.batch_files_data[item]
                preview_file = Path(data['preview_file'])
                original_path = data['path']
                compression_info = data.get('compression_info', {})
                method = compression_info.get('method', '')
                
                # 如果预览文件不存在，尝试查找压缩后的 JPG 版本
                # （PNG转JPG时，实际生成的是 .jpg 文件，但记录的可能是 .png 路径）
                if not preview_file.exists():
                    # 尝试查找同 stem 不同扩展名的文件
                    stem = preview_file.stem
                    parent = preview_file.parent
                    found = False
                    for ext in ['.jpg', '.jpeg', '.png', '.webp']:
                        candidate = parent / f"{stem}{ext}"
                        if candidate.exists() and candidate.is_file():
                            preview_file = candidate
                            found = True
                            print(f"[保存] 找到实际预览文件: {candidate}")
                            break
                    if not found:
                        print(f"[保存] 预览文件不存在，跳过: {data['preview_file']}")
                        fail_count += 1
                        fail_files.append(original_path.name)
                        # 更新状态
                        values = list(self.batch_tree.item(item, 'values'))
                        values[-1] = '✗ 预览不存在'
                        self.batch_tree.item(item, values=values)
                        continue
                
                # 无论格式是否变化，都直接覆盖原文件路径
                # PNG→JPG 的情况：JPG内容覆盖到 .png 文件名上，浏览器根据文件头识别格式，显示正常
                shutil.copy2(preview_file, original_path)
                print(f"[保存] {preview_file.name} → {original_path.name}")
                
                success_count += 1
                
                # 更新状态
                values = list(self.batch_tree.item(item, 'values'))
                values[-1] = '✓ 已保存'
                self.batch_tree.item(item, values=values)
            
            result_msg = f"已成功保存 {success_count}/{len(selected_items)} 个文件！"
            if format_changed_count > 0:
                result_msg += f"\n\n📌 其中 {format_changed_count} 个文件以JPG格式覆盖原PNG（文件名不变）"
            if fail_count > 0:
                result_msg += f"\n\n⚠️ {fail_count} 个文件保存失败（预览文件不存在）：\n"
                result_msg += "\n".join(f"  • {f}" for f in fail_files[:10])
                if len(fail_files) > 10:
                    result_msg += f"\n  ... 等共 {len(fail_files)} 个"
            
            messagebox.showinfo("保存结果", result_msg)
            
        except Exception as e:
            messagebox.showerror("错误", f"保存失败：{str(e)}")
    
    def _format_quality_display(self, compression_info):
        """格式化质量参数显示
        
        Args:
            compression_info: 压缩信息字典
            
        Returns:
            格式化的质量字符串，例如 'JPG Q75'、'PNG L9'、'PNG→JPG Q65'
        """
        method = compression_info.get('method', 'Unknown')
        quality = compression_info.get('quality')
        compress_level = compression_info.get('compress_level')
        
        if method == 'JPG':
            return f'JPG Q{quality}' if quality is not None else 'JPG'
        elif method == 'PNG':
            return f'PNG L{compress_level}' if compress_level is not None else 'PNG'
        elif method == 'PNG→JPG':
            return f'PNG→JPG Q{quality}' if quality is not None else 'PNG→JPG'
        elif method == 'FAILED':
            return '失败'
        else:
            return method
    
    def _format_status_display(self, compression_info, actual_size):
        """格式化状态显示
        
        Args:
            compression_info: 压缩信息字典
            actual_size: 实际大小（字节）
            
        Returns:
            状态字符串
        """
        target_reached = compression_info.get('target_reached', False)
        method = compression_info.get('method', 'Unknown')
        note = compression_info.get('note', '')
        preserve_alpha = compression_info.get('preserve_alpha', False)
        has_real_alpha = compression_info.get('has_real_alpha', False)
        
        if method == 'FAILED':
            return '✗ 失败'
        elif target_reached:
            if method == 'PNG→JPG':
                # 区分不同的转换场景
                if preserve_alpha and not has_real_alpha:
                    # 用户勾选保留透明，但检测到无透明
                    return '✓ 无透明→JPG'
                else:
                    # 用户取消勾选保留透明
                    return '✓ PNG→JPG'
            else:
                return '✓ 预览完成'
        else:
            # 未达到目标
            if method == 'PNG→JPG':
                # 转JPG了但仍未达标
                if preserve_alpha and not has_real_alpha:
                    return f'⚠ 无透明→JPG {self.format_bytes(actual_size)}'
                else:
                    return f'⚠ JPG最优 {self.format_bytes(actual_size)}'
            elif note:
                return f'⚠ {self.format_bytes(actual_size)}'
            else:
                return f'⚠ 最优{self.format_bytes(actual_size)}'
    
    def update_batch_stats(self):
        """更新批量统计信息（根据勾选状态）"""
        total = len(self.batch_files_data)
        selected_count = sum(1 for data in self.batch_files_data.values() if data.get('checked', False))
        
        selected_original_size = sum(
            data['original_size'] for data in self.batch_files_data.values() 
            if data.get('checked', False)
        )
        selected_compressed_size = sum(
            data['compressed_size'] for data in self.batch_files_data.values()
            if data.get('checked', False)
        )
        
        saved = selected_original_size - selected_compressed_size
        saved_percent = (saved / selected_original_size * 100) if selected_original_size > 0 else 0
        
        # 更新显示
        self.stat_total_label.config(text=str(total))
        self.stat_processed_label.config(text=f"{selected_count} 已勾选")
        self.stat_original_size_label.config(text=self.format_bytes(selected_original_size))
        self.stat_compressed_size_label.config(text=self.format_bytes(selected_compressed_size))
        self.stat_saved_label.config(
            text=f"{self.format_bytes(saved)} ({saved_percent:.1f}%)"
        )


def main():
    """主函数"""
    root = tk.Tk()
    app = ImageCompressorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ 程序错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
