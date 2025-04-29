import { Router } from "express";
import { SuggestionsSearch } from "../controller/suggestions-search-controller.js"
import { userAcess } from "../middlewares/userAcess.js"
import { authentication } from "../middlewares/authentication.js"

const suggestionsSearch = new SuggestionsSearch()
export const suggestionsRouter = Router()

suggestionsRouter.use(authentication)
suggestionsRouter.get('/:type', userAcess(["admin"]), suggestionsSearch.index)
suggestionsRouter.post('/:type', userAcess(["admin"]), suggestionsSearch.insert)
suggestionsRouter.delete('/:type', userAcess(["admin"]), suggestionsSearch.remove)