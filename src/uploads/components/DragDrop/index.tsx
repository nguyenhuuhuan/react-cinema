import * as React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { FileUploads } from '../../model';
import { updateData } from '../../service';
import RenderItem from '../RenderFile';

interface Props {
  list: FileUploads[],
  setList: React.Dispatch<React.SetStateAction<FileUploads[] | undefined>>,
  handleDeleteFile: (url: string, source: string) => Promise<void>
}

const DragDrop = (props: Props) => {

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newList = reorder(
      props.list,
      result.source.index,
      result.destination.index
    );
    updateData(newList);
    props.setList(newList);
  };

  const reorder = (listReorder: FileUploads[], startIndex: number, endIndex: number) => {
    const result = Array.from(listReorder);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result as FileUploads[];
  };

  const handleUpdateData = async (data: FileUploads[]) => {
    await updateData(data);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable' direction='vertical'>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.list.map((item, index) => (
              <Draggable key={item.url} draggableId={item.url} index={index}>
                {(provide, _) => (
                  <div
                    key={item.url}
                    className='row card-image'
                    ref={provide.innerRef}
                    style={provide.draggableProps.style}
                    {...provide.draggableProps}
                  >
                    <div {...provide.dragHandleProps} className='col xl1 l1 m1 s1'>
                      <i className='material-icons menu-type'>menu</i>
                      <i onClick={() => props.handleDeleteFile(item.url, item.source)} className='material-icons icon-delete'>delete</i>
                    </div>
                    <RenderItem item={item} />
                  </div>
                )}
              </Draggable>
            )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default DragDrop;

