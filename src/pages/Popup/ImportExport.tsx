import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { shrinkImage } from "./image-processing";
import { PlayerData, usePlayerStoreContext } from "./players.store";
import React from 'react';

export const ImportExport = observer(() => {
    const ctx = usePlayerStoreContext();
    const drop = React.useRef<HTMLLabelElement>(null);
  
    async function handleImport(event: React.FormEvent<HTMLInputElement>){
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        await handleFiles(target.files);
      }
      target.value = '';
    }

    async function handleFiles(files: FileList) {
        const firstFile = files[0];
        if (firstFile.name.endsWith('.gpb')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = JSON.parse(reader.result as string);
            runInAction(() => ctx.players = data);
          };
          reader.readAsText(firstFile);
        } else {
          // Load each image as a new player with player name as the file name without the extension
          for(let i = 0; i < files.length; i++) {
            await addPlayerByFile(files[i]);
          }
        }
    } 
  
    function addPlayerByFile(file: File): Promise<PlayerData[]> {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => {
          const extensionIndex = file.name.lastIndexOf('.');
          const playerName = file.name.substring(0, extensionIndex);
          const imageURL = shrinkImage(image, 256);
          runInAction(() => {
            // add or replace player based on name
            const playerIndex = ctx.players.findIndex(p => p.username.toLowerCase() === playerName.toLowerCase());
            if (playerIndex >= 0) {
              const players = [...ctx.players];
              players[playerIndex] = {...ctx.players[playerIndex], imageURL};
              ctx.players = players;
            }
            else {
              ctx.players = [...ctx.players, {username: playerName, imageURL, note: ''}];
            }
            resolve(ctx.players);
          });
        });
        image.src = URL.createObjectURL(file);
      });
    }
  
    async function handleExport() {
      const contents = JSON.stringify(ctx.players);
      // Open file save dialog
      const newHandle = await (window as any).showSaveFilePicker({
        types: [{
          description: 'Gartic Phonebook Config',
          accept: {'text/plain': ['.gpb']},
        }],
        suggestedName: 'config.gpb',
      });
      if (newHandle) {
        // create a FileSystemWritableFileStream to write to
        const writableStream = await newHandle.createWritable();
  
        // write our file
        const textBlob = new Blob([contents], {type: 'text/plain'});
        await writableStream.write(textBlob);
  
        // close the file and write the contents to disk.
        await writableStream.close();
      }
    }
  
    function handleClear() {
      if (window.confirm('Are you sure you want to clear all players?')) {
        runInAction(() => ctx.players = []);
      }
    }

    React.useEffect(() => {
        if (drop.current) {
            const dropEl = drop.current;
            dropEl.addEventListener('dragover', handleDragOver);
            dropEl.addEventListener('dragleave', handleDragLeave);
            dropEl.addEventListener('drop', handleDrop);
        
            return () => {
                dropEl.removeEventListener('dragenter', handleDragOver);
                dropEl.removeEventListener('dragleave', handleDragLeave);
                dropEl.removeEventListener('drop', handleDrop);
            };
        }
      }, []);
      
      const handleDragOver = (e: DragEvent) => {
        drop.current?.classList.add('drag-over');
        e.preventDefault();
        e.stopPropagation();
      };
      const handleDragLeave = (e: DragEvent) => {
        drop.current?.classList.remove('drag-over');
        e.preventDefault();
        e.stopPropagation();
      };
      
      const handleDrop = (e: DragEvent) => {
        drop.current?.classList.remove('drag-over');
        
        const files = e.dataTransfer?.files;
        if (files) {
            handleFiles(files);
        }
        e.preventDefault();
        e.stopPropagation();
      };
  
    // Import and Export buttons side-by-side
    return (
      <div className='ImportExportHolder flex flex-wrap justify-between items-center'>
        <label className='ImportButton btn cursor-pointer' ref={drop}>
          <input type='file' accept='.gpb,image/*' multiple onChange={handleImport} className="hidden"></input>
          <span>Import</span>
        </label>
        <button className='ClearButton btn' onClick={handleClear} disabled={ctx.players.length === 0}>Clear</button>
        <button type='button' className='ExportButton btn' onClick={handleExport}>
          Export
        </button>
      </div>
    )
  });