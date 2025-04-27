import { Router } from "express";
import { SuggestionsSearch } from "../controller/suggestions-search-controller.js"
import { userAcess } from "../middlewares/userAcess.js"

const suggestionsSearch = new SuggestionsSearch()
export const suggestionsRouter = Router()

suggestionsRouter.use(userAcess(["adm"]))
suggestionsRouter.get('/:type', suggestionsSearch.index)
suggestionsRouter.post('/:type', suggestionsSearch.insert)
suggestionsRouter.delete('/:type', suggestionsSearch.remove)