import { Router } from "express";
import { SuggestionsSearch } from "../controller/suggestions-search-controller.js"
import { userAcess } from "../middlewares/userAcess.js"
import { authentication } from "../middlewares/authentication.js"


const suggestionsSearch = new SuggestionsSearch()
export const suggestionsRouter = Router()

suggestionsRouter.use(authentication)
suggestionsRouter.get('/:type', suggestionsSearch.index)
suggestionsRouter.post('/:type', userAcess(["admin"]), suggestionsSearch.create)
suggestionsRouter.delete('/:type/:id', userAcess(["admin"]), suggestionsSearch.remove)