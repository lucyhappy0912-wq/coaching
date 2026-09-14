"use client";

import { deleteQuestion } from "./actions";

export function DeleteQuestionButton({ id }: { id: string }) {
  return (
    <form
      action={deleteQuestion}
      onSubmit={(event) => {
        if (!window.confirm("삭제하시겠습니까?")) event.preventDefault();
      }}
      className="mt-4"
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="adm-body text-danger hover:underline">
        삭제
      </button>
    </form>
  );
}
