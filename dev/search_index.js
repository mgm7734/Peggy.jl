var documenterSearchIndex = {"docs":
[{"location":"expressions/#Peggy-expression","page":"Expressions","title":"Peggy expression","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Use @peg to create a parser.  You can also use the underly constructor functions which is occasionally useful.","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"All examples assume you have installed Peggy.jl and loaded the package with","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> using Peggy","category":"page"},{"location":"expressions/#String-literal","page":"Expressions","title":"String literal","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Matches a literal string and returns the string.","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia>  (@peg { \"hello\" \"Peggy\" })( \"hello Peggy!\" )\n(\"hello\", \"Peggy\")","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"By default, surroundq whitespace is ignored. You can alter this behavior with the lower-level peggy function:","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> (@peg { peggy(\"a\"; whitespace=r\"\") \"b\"  })( \" ab\" )\nERROR: ParseException @ (no file):1:1\n ab\n^\nexpected: \"a\"\n[...]","category":"page"},{"location":"expressions/#Repetition-and-Optionality","page":"Expressions","title":"Repetition and Optionality","text":"","category":"section"},{"location":"expressions/#N-or-more-repetitions","page":"Expressions","title":"N or more repetitions","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> ( @peg \"a\"*2 )( \"aa\" )\n2-element Vector{SubString{String}}:\n \"a\"\n \"a\"\n\njulia> ( @peg \"a\"*2 )( \"a\" )\nERROR: ParseException @ (no file):1:2\na\n ^\nexpected: \"a\"\n[...]","category":"page"},{"location":"expressions/#Bounded-repetitions","page":"Expressions","title":"Bounded repetitions","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> (@peg { \"a\"*(1:2) })( \"aaaab\" ) \n2-element Vector{SubString{String}}:\n \"a\"\n \"a\"\n\njulia> (@peg { \"a\"*(1:2) })( \"ab\" ) \n1-element Vector{SubString{String}}:\n \"a\"\n\njulia> (@peg { \"a\"*(2:3) })( \"ab\" ) \nERROR: ParseException @ (no file):1:2\nab\n ^\nexpected: \"a\"\n[...]","category":"page"},{"location":"expressions/#Sugar","page":"Expressions","title":"Sugar","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> @peg(x*_) == @peg(x*0)\ntrue\n\njulia> @peg(x+_) == @peg(x*1)\ntrue\n\njulia> @peg(a*1) == @peg(a*(1:missing))\ntrue\n\njulia> @peg{ a*(0:1) }\n@peg([a])","category":"page"},{"location":"expressions/#Sequence","page":"Expressions","title":"Sequence","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Yields a tuple of values.","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> (@peg { \"a\"*_ \"b\" END() })( \"aaab\" ) \n(SubString{String}[\"a\", \"a\", \"a\"], \"b\", ())","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Each sequence items has a name.  Grammar references are already a name.  Other types of items are givent the default name \"_\", but a different name can be assigned with =.","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Items with names that start with \"_\" are discared.   If only one item remains, its value becomes the value of the sequence. Otherwise the value is a tuple of the named item values.","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> (@peg { result=\"a\"*_ \"b\" END() })( \"aaab\" ) \n3-element Vector{SubString{String}}:\n \"a\"\n \"a\"\n \"a\"","category":"page"},{"location":"expressions/#Mapping","page":"Expressions","title":"Mapping","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> (@peg { as=\"a\"*_ \"b\" END()  :> { length(as) } })( \"aaab\" ) \n3","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> (@peg { as=\"a\"*_ \"b\" END()  :> length })( \"aaab\" ) \n3","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"warning: Squirrely Curly\nJulia's parsing of curly-braces is mostly the same as for square-brackets.  But it has a strange interaction with unary operators.","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> Meta.show_sexpr(:( !{ a } ))\n(:curly, :!, :a)\njulia> Meta.show_sexpr(:( ![ a ] ))\n(:call, :!, (:vect, :a))","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Use parentheses to avoid problems:","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> Meta.show_sexpr(:( !({ a }) ))\n(:call, :!, (:braces, :a))","category":"page"},{"location":"expressions/#End-of-string","page":"Expressions","title":"End of string","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Matches the end of the input string. Consumes nothing, returns ().","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> ( END() )(\"\")\n()\n\njulia> ( END() )(\"something\")\nERROR: ParseException @ (no file):1:1\nsomething\n^\nexpected: END()\n[...]","category":"page"},{"location":"expressions/#Character-class","page":"Expressions","title":"Character class","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> ( CHAR(\"[:alpha:]_\")*0  )( \"böse_7734!\" )\n5-element Vector{SubString{String}}:\n \"b\"\n \"ö\"\n \"s\"\n \"e\"\n \"_\"\n\njulia> ( @peg( CHAR[\"[:alpha:]\"]*_ ) )(\"ok\")\n2-element Vector{SubString{String}}:\n \"o\"\n \"k\"","category":"page"},{"location":"expressions/#Grammar","page":"Expressions","title":"Grammar","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Here's the PEG syntax from wikipedia's Parsing expression grammar article:","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> wikisyntax = @peg begin\n       grammar = { rules=rule+_             :> { grammar(rules...) } }\n       rule = { name \"←\" expr               :> { name => expr }}\n       expr = { alt as={ \"/\" alt }*_        :> { oneof(alt, as...)} }\n       alt =  { is=item+_                   :> { peggy(is...) } }\n       item = {\n            prim \"*\"                        :> { many(prim) }\n            prim \"+\"                        :> { many(prim; min=1) }\n            prim \"?\"                        :> { many(prim; max=1) }\n            \"&\" prim                        :> { followedby(prim) }\n            \"!\" item                        :> { !item }\n            prim\n       }\n       prim = { \n            name !\"←\" \n            \"[\" charclass \"]\"               :> { CHAR(charclass) }\n            \"'\" string \"'\"                  :> { peggy(string) }\n            \"(\" expr \")\" \n            \".\"                             :> _ -> ANY()\n       }\n       name = { cs=CHAR(\"[:alpha:]_\")+_ CHAR(raw\"\\s\")*_     :> { Symbol(cs...) } }\n       charclass = {\n            \"-\" [ \"]\" ] CHAR(\"^]\")*_        :> t -> string(t[1], t[2]..., t[3]...)\n            \"]\" CHAR(\"^]\")*_                :> t -> string(t[1], t[2]...)\n            CHAR(\"^]\")+_                    :> t -> string(t...)\n       }\n       string = { ({ \"''\" :> _->\"'\" } | CHAR(\"^'\"))*_  :> Base.splat(*) }\n       end;","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"Here's the non-CFG example that matches aⁿbⁿcⁿ:","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> S = wikisyntax(\"\"\"\n       S ← &(A 'c') 'a'+ B !.\n       A ← 'a' A? 'b'\n       B ← 'b' B? 'c'\n       \"\"\")\n@peg(begin\n  A={ \"a\" [A] \"b\" }\n  B={ \"b\" [B] \"c\" }\n  S={ followedby({ A \"c\" }) \"a\"+_ B END() }\nend)","category":"page"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> S(\"aabbc\")\nERROR: ParseException @ (no file):1:6\naabbc\n     ^\nexpected: \"c\"\n[...]","category":"page"},{"location":"expressions/#Left-recursion","page":"Expressions","title":"Left recursion","text":"","category":"section"},{"location":"expressions/#Not","page":"Expressions","title":"Not","text":"","category":"section"},{"location":"expressions/#Lookahead","page":"Expressions","title":"Lookahead","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"followedby","category":"page"},{"location":"expressions/#Failure","page":"Expressions","title":"Failure","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"julia> p = @peg begin\n           cmd = { \"say\" word  :> { \"You said: $word\" } }\n           word = { \n        !\"FLA\" cs=CHAR(\"[:alpha:]\")+_  :> { *(cs...) } \n        \"FLA\" fail(\"don't say FLA\")\n           }\n           end;\n\njulia> p(\"say hello\")\n\"You said: hello\"\n\njulia> p(\"say FLA\")\nERROR: ParseException @ (no file):1:8\nsay FLA\n       ^\nexpected: don't say FLA\n[...]","category":"page"},{"location":"expressions/#Regular-Expressions","page":"Expressions","title":"Regular Expressions","text":"","category":"section"},{"location":"expressions/","page":"Expressions","title":"Expressions","text":"note: Regular expressions can kill performance.\nBy default, r\"[[:space:]*\" is translated to Peggy.RegexParser(\"[[:space:]]*\") because Peggy assumes the expression can match an empty string.  That assumption may cause a rule to be deemed left-recursive, which has some overhead.  If you know your expression does not match \"\", you can use option canmatchempty. For example, Peggy's PCRE class express :[\"[:space]\"] expands to `Peggy.RegexParser(\"[[:space]]\"; canmatchempty=false).","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = Peggy\nusing Peggy","category":"page"},{"location":"#Peggy","page":"Home","title":"Peggy","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Generate Packrat PEG parsers for Julia ","category":"page"},{"location":"","page":"Home","title":"Home","text":"Features:","category":"page"},{"location":"","page":"Home","title":"Home","text":"pretty good syntax error messages. \ndetects indirect left-recursive rules during compilation. Only left-recursive rules pay a performance cost\nboth combinator functions and a macro are provided","category":"page"},{"location":"","page":"Home","title":"Home","text":"A Peggy.Parser is function that takes a string as input and returns its parsed value.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Create parsers using either a succinct Peggy expression via the @peg macro or lower-level functions.","category":"page"},{"location":"#Index","page":"Home","title":"Index","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [Peggy]","category":"page"},{"location":"#Peggy.Parser","page":"Home","title":"Peggy.Parser","text":"(parser::Parser)(input)\n\nA Peggy.Parser is function that takes a string as input and returns its parsed value.\n\n\n\n\n\n","category":"type"},{"location":"#Base.:!-Tuple{Parser}","page":"Home","title":"Base.:!","text":"!(p::Parser) == not(p)\n\n\n\n\n\n","category":"method"},{"location":"#Base.:*-Tuple{Parser, Int64}","page":"Home","title":"Base.:*","text":"p::Parser * n == many(p; min=n)\np::Parser * (a:b) == many(p; min=a, max=b)\n\n\n\n\n\n","category":"method"},{"location":"#Base.:|-Tuple{Parser, Parser}","page":"Home","title":"Base.:|","text":" p1::Parser | p2::Parser == oneof(p1, p2)\n\nA short-form for oneof.\n\n\n\n\n\n","category":"method"},{"location":"#Base.tryparse-Tuple{Parser, AbstractString}","page":"Home","title":"Base.tryparse","text":"tryparse(parser, input)\n\nLike parser(input), but returns nothing if the parse fails.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.ANY-Tuple{}","page":"Home","title":"Peggy.ANY","text":"A PEG parser that matches any character and yields it as a string.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.CHAR-Tuple{String}","page":"Home","title":"Peggy.CHAR","text":"CHAR(charclass::String)\n\nCreate a parser for a single character matchng regex character classes. \n\nFunctionally identical to Regex(\"[charclass]\") except it is known to never match an empty string.  This is important to avoid unneccesary and expensive left-recursion overhead.\n\nExamples\n\njulia> g = @grammar begin\n       number = [ digit ds:(digit...)  { parse(Int, *(digit, ds...)) } ]\n       digit = CHAR(\"[:digit:]\")\n       end;\n\njulia> g(\"1234\")\n1234\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.END-Tuple{}","page":"Home","title":"Peggy.END","text":"A PEG parser that matches the end of the input; yields result ().\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.fail-Tuple{Any}","page":"Home","title":"Peggy.fail","text":"fail(message) => Parser\n\nA parser that always fails with the given message.\n\nUseful for error messages.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.followedby-Tuple","page":"Home","title":"Peggy.followedby","text":"followedby(expr...)\n!!(e::Parser)\n\nCreate a parser that matches expr but consumes nothing.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.grammar-Tuple{Symbol, Vararg{Pair{Symbol}}}","page":"Home","title":"Peggy.grammar","text":"grammar([start::Symbol], (symbol => peg_expr)...)\n\nCreate a parser from a set of productions, which are named, mutually recursive parsers.  \n\nParsers that are members of a grammar can reference are member parser by their symbol.\n\nIf start is omitted, the symbol of the first production is used.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.many-Tuple","page":"Home","title":"Peggy.many","text":"many(exprs...; min=0, max=missing)\n\nCreate a parser that matches zero or more repititions of the sequence expr...; returns a vector of results.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.not-Tuple{Any}","page":"Home","title":"Peggy.not","text":"not(expr)\n\nCreate a parser that fails if parser p succeeds. Otherwise it succeeds with value ()\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.oneof-Tuple","page":"Home","title":"Peggy.oneof","text":"oneof(pegexpr...)\n\nCreate a parser for ordered alternatives.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.peggy-Tuple{Parser}","page":"Home","title":"Peggy.peggy","text":"peggy(expr...; whitespace=r\"[[:space:]]*\")\n\nCreate a Parser from a PEG expression.\n\nThe parser matches each expr sequentiallly and returns the combined results (details below).\n\nEach expr can be one of the following.\n\nString - matches & yields the string literal\nRegex - matches the Regex and yields the match value (but avoid this)\nSymbol - matches to expression associated with the symbol in a grammar.\nSymbol => expr - matches expr and assign it a names. \nexpr => callable - matches expr and yields result of applying callable to its value.\npeg_epxr => k - short-hand for expr => _ -> k`\n(expr, exprs...) - same as peggy(expr, exprs...)\n[expr, exprs...] - same as many(expr, exprs; max=1)\nParser - any expression that yields a parser\n\nNames and sequence results\n\nEach element of a sequence has a name.  Symbol and Symbol => expr take the name of the symbol. All other expressions are named \":_\". The value of the sequence is then formed as follows.\n\nDiscard values with names starting with \"_\" if there are any that do not.  If a single value remains, that is the sequence value. Othewise the value is a Vector of the remaining values.\n\nWhitespace\n\nString literals by default ignore surrounding whitespace.  Use option whitespace=r\"\" to disable this.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.runpeg-Tuple{Parser, AbstractString}","page":"Home","title":"Peggy.runpeg","text":"runpeg(e::Parser, s::AbstractString) => result_value\n\nParse the input with the parser.\n\nReturns the resulting value or throws a ParseException.\n\n\n\n\n\n","category":"method"},{"location":"#Peggy.@peg-Tuple{Any}","page":"Home","title":"Peggy.@peg","text":"Create a Peggy.Parser from a Peggy expression\n\n\n\n\n\n","category":"macro"}]
}
