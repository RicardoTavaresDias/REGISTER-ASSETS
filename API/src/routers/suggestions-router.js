import { Router } from "express";
import { SuggestionsSearch } from "../controller/suggestions-search-controller.js"

const suggestionsSearch = new SuggestionsSearch()
export const suggestionsRouter = Router()

suggestionsRouter.get('/:type', suggestionsSearch.index)
suggestionsRouter.post('/:type', suggestionsSearch.insert)
suggestionsRouter.delete('/:type', suggestionsSearch.remove)