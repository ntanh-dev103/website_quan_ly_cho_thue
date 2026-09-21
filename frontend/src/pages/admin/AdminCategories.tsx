import { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Folder, Edit2, Trash2, Plus, ChevronRight, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useCategoryStore } from '@/entities/product/useCategoryStore';
import type { Category } from '@/entities/product/product.types';
import { toast } from 'sonner';

// Simplified Sortable Item
function SortableCategoryItem({ category, depth, onEdit, onDelete }: { category: Category, depth: number, onEdit: any, onDelete: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px`
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg shadow-sm mb-2 group hover:border-primary-200 transition-colors">
      <div {...attributes} {...listeners} className="cursor-grab p-1 text-gray-400 hover:text-gray-600">
        <GripVertical className="h-4 w-4" />
      </div>
      <Folder className="h-4 w-4 text-blue-500" />
      <span className="font-medium text-sm text-gray-900 flex-1">{category.name}</span>
      <div className="flex items-center gap-2 text-xs text-gray-500 mr-2">
        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{category.availableAttributes.length} EAV</span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(category)} className="p-1 text-gray-500 hover:text-primary-600"><Edit2 className="h-3.5 w-3.5" /></button>
        <button onClick={() => onDelete(category)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

export function AdminCategories() {
  const { categories, updateCategory } = useCategoryStore();
  const [activeCat, setActiveCat] = useState<Category | null>(categories[0] || null);

  // Flatten categories for simple rendering in Demo
  const flattenedCategories = categories.flatMap(c => [
    { ...c, depth: 0 },
    ...(c.children || []).map(sub => ({ ...sub, depth: 1 }))
  ]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      toast.success('Đã cập nhật vị trí danh mục');
    }
  };

  const handleDelete = (cat: Category) => {
    if (cat.children && cat.children.length > 0) {
      toast.error('Không thể xóa danh mục đang chứa danh mục con!');
      return;
    }
    toast.success('Xóa danh mục thành công (Mock)');
  };

  const handleEavChange = (attrId: string, field: string, value: any) => {
    if (!activeCat) return;
    const newAttrs = activeCat.availableAttributes.map(a => a.id === attrId ? { ...a, [field]: value } : a);
    setActiveCat({ ...activeCat, availableAttributes: newAttrs });
  };

  const handleSave = () => {
    if (activeCat) {
      updateCategory(activeCat.id, activeCat);
      toast.success('Lưu thông tin danh mục thành công!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục & EAV</h1>
          <p className="text-gray-500 mt-1">Cấu hình cây danh mục và các thuộc tính động</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Thêm danh mục gốc
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT PANEL: Tree View */}
        <div className="w-[60%] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Cây danh mục (Drag & Drop)</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={flattenedCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {flattenedCategories.map(cat => (
                  <SortableCategoryItem 
                    key={cat.id} 
                    category={cat as any} 
                    depth={cat.depth} 
                    onEdit={() => setActiveCat(cat as any)} 
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="w-[40%] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {activeCat ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm">Chỉnh sửa: {activeCat.name}</h3>
                <Button size="sm" onClick={handleSave}>Lưu thay đổi</Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin cơ bản</h4>
                  <div className="space-y-2">
                    <Label>Tên danh mục (VI)</Label>
                    <Input value={activeCat.name} onChange={e => setActiveCat({ ...activeCat, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Đường dẫn (Slug)</Label>
                    <Input value={activeCat.slug} disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thuộc tính EAV</h4>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Thêm
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {activeCat.availableAttributes.map(attr => (
                      <div key={attr.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input 
                              value={attr.name} 
                              className="h-8 text-sm font-medium" 
                              onChange={e => handleEavChange(attr.id, 'name', e.target.value)}
                            />
                          </div>
                          <select 
                            className="h-8 text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            value={attr.type}
                            onChange={e => handleEavChange(attr.id, 'type', e.target.value)}
                          >
                            <option value="text">Văn bản</option>
                            <option value="number">Số</option>
                            <option value="options">Lựa chọn (Select)</option>
                          </select>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {attr.type === 'options' && (
                          <div className="pl-2">
                            <Label className="text-xs text-gray-500 mb-1 block">Các lựa chọn (Chips)</Label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {attr.options?.map(opt => (
                                <span key={opt} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs px-2 py-1 rounded-md shadow-sm">
                                  {opt}
                                  <X className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer" />
                                </span>
                              ))}
                              <Input className="h-6 w-24 text-xs px-2 border-dashed bg-transparent" placeholder="+ Thêm..." />
                            </div>
                          </div>
                        )}
                        
                        {attr.type === 'number' && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Đơn vị:</span>
                            <Input 
                              value={attr.unit || ''} 
                              className="h-6 w-16 text-xs px-2" 
                              placeholder="VD: cm"
                              onChange={e => handleEavChange(attr.id, 'unit', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
              <ChevronRight className="w-12 h-12 text-gray-200 mb-2" />
              <p>Chọn một danh mục bên trái để xem và chỉnh sửa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
