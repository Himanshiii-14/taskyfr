"use client";
import { useTasks } from "@/context/taskContext";
import useDetectOutside from "@/hooks/useDetectOutside";
import React, { useEffect } from "react";

function Modal() {
  const {
    task,
    handleInput,
    createTask,
    isEditing,
    closeModal,
    modalMode,
    activeTask,
    updateTask,
  } = useTasks();
  const ref = React.useRef(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Use the hook to detect clicks outside the modal
  useDetectOutside({
    ref,
    callback: () => {
      if (isEditing) {
        closeModal(); // Close modal if it is in add/edit mode
      }
    },
  });

  useEffect(() => {
    if (modalMode === "edit" && activeTask) {
      handleInput("setTask")(activeTask);
    }
  }, [modalMode, activeTask]);

  const handleBoldShortcut = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = task.description?.substring(start, end) || '';
    
    // Bold: Ctrl+B (toggle)
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      
      if (selectedText) {
        const beforeText = task.description?.substring(0, start) || '';
        const afterText = task.description?.substring(end) || '';
        
        // Check if already bold
        if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
          // Remove bold
          const unboldedText = selectedText.slice(2, -2);
          const newText = `${beforeText}${unboldedText}${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = end - 4;
            textarea.focus();
          }, 0);
        } else {
          // Add bold
          const newText = `${beforeText}**${selectedText}**${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = end + 4;
            textarea.focus();
          }, 0);
        }
      }
    }
    
    // Italic: Ctrl+I (toggle)
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      
      if (selectedText) {
        const beforeText = task.description?.substring(0, start) || '';
        const afterText = task.description?.substring(end) || '';
        
        // Check if already italic
        if (selectedText.startsWith('*') && selectedText.endsWith('*') && !selectedText.startsWith('**')) {
          // Remove italic
          const unitalicText = selectedText.slice(1, -1);
          const newText = `${beforeText}${unitalicText}${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = end - 2;
            textarea.focus();
          }, 0);
        } else {
          // Add italic
          const newText = `${beforeText}*${selectedText}*${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = end + 2;
            textarea.focus();
          }, 0);
        }
      }
    }
    
    // Underline: Ctrl+U (toggle)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      
      if (selectedText) {
        const beforeText = task.description?.substring(0, start) || '';
        const afterText = task.description?.substring(end) || '';
        
        // Check if already underlined
        if (selectedText.startsWith('<u>') && selectedText.endsWith('</u>')) {
          // Remove underline
          const ununderlinedText = selectedText.slice(3, -4);
          const newText = `${beforeText}${ununderlinedText}${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = end - 7;
            textarea.focus();
          }, 0);
        } else {
          // Add underline
          const newText = `${beforeText}<u>${selectedText}</u>${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = end + 7;
            textarea.focus();
          }, 0);
        }
      }
    }
    
    // Numbered List: Ctrl+H (toggle)
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      
      if (selectedText) {
        const lines = selectedText.split('\n');
        const beforeText = task.description?.substring(0, start) || '';
        const afterText = task.description?.substring(end) || '';
        
        // Check if already numbered
        const isNumbered = lines.some(line => /^\d+\.\s/.test(line.trim()));
        
        if (isNumbered) {
          // Remove numbering
          const unnumberedLines = lines.map(line => {
            return line.replace(/^\s*\d+\.\s*/, '');
          }).join('\n');
          
          const newText = `${beforeText}${unnumberedLines}${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + unnumberedLines.length;
            textarea.focus();
          }, 0);
        } else {
          // Add numbering
          let counter = 1;
          const numberedLines = lines.map((line) => {
            if (line.trim()) {
              return `${counter++}. ${line}`;
            }
            return line;
          }).join('\n');
          
          const newText = `${beforeText}${numberedLines}${afterText}`;
          handleInput("description")({ target: { value: newText } } as any);
          
          setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + numberedLines.length;
            textarea.focus();
          }, 0);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === "edit") {
      updateTask(task);
    } else if (modalMode === "add") {
      createTask(task);
    }
    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        action=""
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        ref={ref}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="text"
            id="title"
            placeholder="Task Title"
            name="title"
            value={task.title}
            onChange={(e) => handleInput("title")(e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            ref={textareaRef}
            className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
            name="description"
            placeholder="Task Description (Ctrl+B: Bold, Ctrl+I: Italic, Ctrl+U: Underline, Ctrl+H: Numbered List)"
            rows={4}
            value={task.description}
            onChange={(e) => handleInput("description")(e)}
            onKeyDown={handleBoldShortcut}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="priority">Select Priority</label>
          <select
            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
            name="priority"
            value={task.priority}
            onChange={(e) => handleInput("priority")(e)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate">Due Date</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={(e) => handleInput("dueDate")(e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="completed">Task Completed</label>
          <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
            <label htmlFor="completed">Completed</label>
            <div>
              <select
                className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
                name="completed"
                value={task.completed ? "true" : "false"}
                onChange={(e) => handleInput("completed")(e)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className={`text-white py-2 rounded-md w-full hover:bg-blue-500 transition duration-200 ease-in-out ${
              modalMode === "edit" ? "bg-blue-400" : "bg-green-400"
            }`}
          >
            {modalMode === "edit" ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
